import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { theme } from '@/constants/theme';
import { restaurants } from '@/mocks/restaurants';
import { Restaurant } from '@/mocks/restaurants';
import { Star, Clock, MapPin } from 'lucide-react-native';

export default function RestaurantDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching restaurant data
    // In a real app, this would be a Supabase query
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        // Find restaurant from mock data
        const foundRestaurant = restaurants.find(r => r.id === id);
        setRestaurant(foundRestaurant || null);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRestaurant();
    }
  }, [id]);

  const getTagColor = (color: string) => {
    switch (color) {
      case 'red':
        return { backgroundColor: '#FEE2E2', color: '#DC2626' };
      case 'blue':
        return { backgroundColor: '#DBEAFE', color: '#2563EB' };
      case 'yellow':
        return { backgroundColor: '#FEF3C7', color: '#D97706' };
      case 'green':
        return { backgroundColor: '#D1FAE5', color: '#059669' };
      default:
        return { backgroundColor: theme.colors.grayLight, color: theme.colors.textLight };
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading restaurant details...</Text>
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Restaurant not found</Text>
      </View>
    );
  }

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
          <Image source={{ uri: restaurant.image }} style={styles.heroImage} />
          <View style={styles.logoContainer}>
            <Image source={{ uri: restaurant.logo }} style={styles.logo} />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{restaurant.name}</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.rating}>{restaurant.rating}</Text>
            </View>
            <View style={styles.infoItem}>
              <Clock size={16} color={theme.colors.textLight} />
              <Text style={styles.infoText}>{restaurant.deliveryTime}</Text>
            </View>
            <View style={styles.infoItem}>
              <MapPin size={16} color={theme.colors.textLight} />
              <Text style={styles.infoText}>{restaurant.cuisineType}</Text>
            </View>
          </View>

          <View style={styles.tagsContainer}>
            {restaurant.tags.map((tag, index) => {
              const tagStyle = getTagColor(tag.color);
              return (
                <View 
                  key={index} 
                  style={[styles.tag, { backgroundColor: tagStyle.backgroundColor }]}
                >
                  <Text style={[styles.tagText, { color: tagStyle.color }]}>
                    {tag.text}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>
              Experience the finest {restaurant.cuisineType.toLowerCase()} cuisine with fresh, 
              locally-sourced ingredients. Our chefs prepare each dish with passion and attention 
              to detail, ensuring every meal is a memorable experience.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location & Hours</Text>
            <Text style={styles.description}>
              Open daily from 11:00 AM to 10:00 PM{'\n'}
              Delivery available in your area{'\n'}
              Average delivery time: {restaurant.deliveryTime}
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  tag: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  tagText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
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
});