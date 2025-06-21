import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { useUserStore } from '@/store/userStore';
import { useMealsStore } from '@/store/mealsStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { NutritionSummary } from '@/components/NutritionSummary';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { MealCard } from '@/components/MealCard';
import { RestaurantCarousel } from '@/components/RestaurantCarousel';
import { Button } from '@/components/Button';
import { Sparkles } from 'lucide-react-native';

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
  
  // Get random meal for "Surprise Me" feature
  const getRandomMeal = () => {
    const randomIndex = Math.floor(Math.random() * meals.length);
    return meals[randomIndex];
  };
  
  const handleSurpriseMe = () => {
    const randomMeal = getRandomMeal();
    router.push(`/meal/${randomMeal.id}`);
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
          <Text style={styles.sectionTitle}>Featured Meals</Text>
          <Pressable onPress={handleSurpriseMe} style={styles.surpriseButton}>
            <Sparkles size={16} color={theme.colors.primary} />
            <Text style={styles.surpriseText}>Surprise Me</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredMealsContainer}
        >
          {filteredMeals.slice(0, 5).map((meal) => (
            <MealCard key={meal.id} meal={meal} compact />
          ))}
        </ScrollView>
      </View>

      <RestaurantCarousel
        title="Our Partners"
        onPressItem={(id) => console.log(`Restaurant ${id} pressed`)}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
  },
  surpriseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  surpriseText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.medium,
    marginLeft: theme.spacing.xs,
  },
  featuredMealsContainer: {
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