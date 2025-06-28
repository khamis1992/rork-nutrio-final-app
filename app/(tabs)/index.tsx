import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Image } from 'react-native';
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
  const { user } = useUserStore();
  const { meals, selectedCategory, setSelectedCategory } = useMealsStore();
  const { subscription } = useSubscriptionStore();
  
  // Get today's progress
  const todayProgress = user?.progress[user.progress.length - 1];
  
  // Filter meals by category
  const filteredMeals = selectedCategory === 'all'
    ? meals
    : meals.filter(meal => 
        meal.category.some(cat => cat.toLowerCase() === selectedCategory.toLowerCase())
      );

  const handleRestaurantPress = (id: string) => {
    console.log(`Restaurant ${id} pressed`);
    // In a real app, this would navigate to restaurant details
  };

  const handleToggleFavorite = (id: string) => {
    console.log(`Toggle favorite for restaurant ${id}`);
    // In a real app, this would update favorite status
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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

      <SubscriptionCard subscription={subscription} />

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
          {restaurants.slice(0, 5).map((restaurant) => (
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
      />

      <View style={styles.gymAccessSection}>
        <View style={styles.gymAccessContent}>
          <Text style={styles.gymAccessTitle}>Gym Access Included</Text>
          <Text style={styles.gymAccessDescription}>
            Your subscription includes access to premium gyms in your area
          </Text>
          <Button
            title="View Gyms"
            onPress={() => router.push('/gyms')}
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
      </View>
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