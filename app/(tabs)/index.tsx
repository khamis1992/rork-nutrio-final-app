import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Image, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { useUserStore } from '@/store/userStore';
import { useMealsStore } from '@/store/mealsStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { restaurants } from '@/mocks/restaurants';
import { NutritionSummary } from '@/components/NutritionSummary';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { MealCard } from '@/components/MealCard';
import { RestaurantCard } from '@/components/RestaurantCard';
import { RestaurantCarousel } from '@/components/RestaurantCarousel';
import { Button } from '@/components/Button';

export default function HomeScreen() {
  const router = useRouter();
  const { user, initializeUser } = useUserStore();
  const { meals, selectedCategory, setSelectedCategory } = useMealsStore();
  const { subscription, fetchSubscription } = useSubscriptionStore();
  const [refreshing, setRefreshing] = useState(false);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Set<string>>(new Set());
  
  // Get today's progress
  const todayProgress = user?.progress[user.progress.length - 1];
  
  // Filter meals by category
  const filteredMeals = selectedCategory === 'all'
    ? meals
    : meals.filter(meal => 
        meal.category.some(cat => cat.toLowerCase() === selectedCategory.toLowerCase())
      );

  // Get featured restaurants (top 5 with highest ratings)
  const featuredRestaurants = restaurants
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5)
    .map(restaurant => ({
      ...restaurant,
      isFavorite: favoriteRestaurants.has(restaurant.id)
    }));

  useEffect(() => {
    // Initialize user and fetch data when component mounts
    const initializeData = async () => {
      try {
        await initializeUser();
        await fetchSubscription();
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };

    initializeData();
  }, [initializeUser, fetchSubscription]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await initializeUser();
      await fetchSubscription();
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  }, [initializeUser, fetchSubscription]);

  const handleRestaurantPress = (id: string) => {
    // Navigate to restaurant details (placeholder for now)
    console.log(`Restaurant ${id} pressed`);
    // router.push(`/restaurant/${id}`);
  };

  const handleToggleFavorite = (id: string) => {
    setFavoriteRestaurants(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const handleViewAllRestaurants = () => {
    // Navigate to all restaurants screen (placeholder for now)
    console.log('View all restaurants pressed');
    // router.push('/restaurants');
  };

  const handleSubscribePress = () => {
    router.push('/subscription');
  };

  const handleMyPlanPress = () => {
    router.push('/my-plan');
  };

  const handleGymAccessPress = () => {
    router.push('/gyms');
  };

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back, {user?.name || 'Guest'}</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      <Pressable onPress={subscription.active ? handleMyPlanPress : handleSubscribePress}>
        <SubscriptionCard subscription={subscription} />
      </Pressable>

      {todayProgress && (
        <NutritionSummary
          calories={todayProgress.calories}
          protein={todayProgress.protein}
          carbs={todayProgress.carbs}
          fat={todayProgress.fat}
          caloriesGoal={user?.dailyGoals.calories}
          proteinGoal={user?.dailyGoals.protein}
          carbsGoal={user?.dailyGoals.carbs}
          fatGoal={user?.dailyGoals.fat}
          compact
        />
      )}

      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <View style={styles.featuredSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Restaurants</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredContainer}
        >
          {featuredRestaurants.map((restaurant) => (
            <RestaurantCard 
              key={restaurant.id} 
              restaurant={restaurant}
              onPress={() => handleRestaurantPress(restaurant.id)}
              onToggleFavorite={() => handleToggleFavorite(restaurant.id)}
            />
          ))}
        </ScrollView>
      </View>

      <RestaurantCarousel
        title="Partnered Restaurants"
        onPressItem={handleRestaurantPress}
        onToggleFavorite={handleToggleFavorite}
        onViewAll={handleViewAllRestaurants}
      />

      <Pressable style={styles.gymAccessSection} onPress={handleGymAccessPress}>
        <View style={styles.gymAccessContent}>
          <Text style={styles.gymAccessTitle}>Gym Access Included</Text>
          <Text style={styles.gymAccessDescription}>
            Your subscription includes access to premium gyms in your area
          </Text>
          <Button
            title="View Gyms"
            onPress={handleGymAccessPress}
            variant="outline"
            size="small"
            style={styles.gymAccessButton}
          />
        </View>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
          }}
          style={styles.gymAccessImage}
        />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  greeting: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  date: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textLight,
  },
  featuredSection: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
  },
  featuredContainer: {
    paddingHorizontal: theme.spacing.md,
  },
  gymAccessSection: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.md,
  },
  gymAccessContent: {
    flex: 1,
    padding: theme.spacing.md,
  },
  gymAccessTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  gymAccessDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.md,
  },
  gymAccessButton: {
    alignSelf: 'flex-start',
  },
  gymAccessImage: {
    width: 120,
    height: '100%',
    resizeMode: 'cover',
  },
});