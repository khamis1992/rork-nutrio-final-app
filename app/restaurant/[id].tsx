import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, ActivityIndicator, FlatList } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { theme } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useMealsStore, Meal } from '@/store/mealsStore';
import { MealCard } from '@/components/MealCard';
import { Star, Clock, MapPin } from 'lucide-react-native';

interface Restaurant {
  id: string;
  name: string;
  logo_url: string | null;
  image_url: string | null;
  rating: number;
  cuisine_type: string | null;
  delivery_time: string | null;
}

export default function RestaurantDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { fetchMealsByRestaurant } = useMealsStore();

  useEffect(() => {
    const fetchRestaurantData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch restaurant data
        const { data: restaurantData, error: restaurantError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', id)
          .single();

        if (restaurantError) {
          throw new Error(restaurantError.message);
        }

        setRestaurant(restaurantData);

        // Fetch meals for this restaurant
        const restaurantMeals = await fetchMealsByRestaurant(id);
        setMeals(restaurantMeals);

      } catch (err: any) {
        console.error('Error fetching restaurant data:', err);
        setError(err.message || 'Failed to load restaurant data');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [id, fetchMealsByRestaurant]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading restaurant details...</Text>
      </View>
    );
  }

  if (error || !restaurant) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || 'Restaurant not found'}
        </Text>
      </View>
    );
  }

  const renderMealItem = ({ item }: { item: Meal }) => (
    <View style={styles.mealItem}>
      <MealCard meal={item} />
    </View>
  );

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: restaurant.name,
          headerBackTitle: "Back",
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ 
              uri: restaurant.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            }} 
            style={styles.heroImage} 
          />
          <View style={styles.logoContainer}>
            <Image 
              source={{ 
                uri: restaurant.logo_url || 'https://images.unsplash.com/photo-1581349485608-9469926a8e5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
              }} 
              style={styles.logo} 
            />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{restaurant.name}</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.rating}>{restaurant.rating.toFixed(1)}</Text>
            </View>
            {restaurant.delivery_time && (
              <View style={styles.infoItem}>
                <Clock size={16} color={theme.colors.textLight} />
                <Text style={styles.infoText}>{restaurant.delivery_time}</Text>
              </View>
            )}
            {restaurant.cuisine_type && (
              <View style={styles.infoItem}>
                <MapPin size={16} color={theme.colors.textLight} />
                <Text style={styles.infoText}>{restaurant.cuisine_type}</Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>
              Experience the finest {restaurant.cuisine_type?.toLowerCase() || 'cuisine'} with fresh, 
              locally-sourced ingredients. Our chefs prepare each dish with passion and attention 
              to detail, ensuring every meal is a memorable experience.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Meals ({meals.length})</Text>
            {meals.length > 0 ? (
              <FlatList
                data={meals}
                renderItem={renderMealItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <Text style={styles.noMealsText}>No meals available at this restaurant.</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location & Hours</Text>
            <Text style={styles.description}>
              Open daily from 11:00 AM to 10:00 PM{'\n'}
              Delivery available in your area{'\n'}
              {restaurant.delivery_time && `Average delivery time: ${restaurant.delivery_time}`}
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textLight,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  errorText: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.textLight,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  logoContainer: {
    position: 'absolute',
    bottom: -30,
    left: theme.spacing.md,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  content: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xl + theme.spacing.md,
  },
  name: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  rating: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  infoText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textLight,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textLight,
    lineHeight: 22,
  },
  mealItem: {
    marginBottom: theme.spacing.sm,
  },
  noMealsText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: theme.spacing.lg,
  },
});