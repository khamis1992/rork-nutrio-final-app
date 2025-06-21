import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { useMealsStore } from '@/store/mealsStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { PlannedMealCard } from '@/components/PlannedMealCard';
import { Button } from '@/components/Button';

export default function MyPlanScreen() {
  const router = useRouter();
  const { meals, plannedMeals, getMealById, removeMealFromPlan } = useMealsStore();
  const { subscription } = useSubscriptionStore();
  const [isLoading, setIsLoading] = useState(false);

  // Group planned meals by date
  const groupedMeals = plannedMeals.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const handleRemoveMeal = (date: string, mealTime: string) => {
    Alert.alert(
      "Remove Meal",
      "Are you sure you want to remove this meal from your plan?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Remove", 
          onPress: () => removeMealFromPlan(date, mealTime),
          style: "destructive"
        }
      ]
    );
  };

  const handleSwapMeal = (date: string, mealTime: string) => {
    router.push({
      pathname: '/meals',
      params: { date, mealTime, action: 'swap' }
    });
  };

  if (!subscription.active) {
    return (
      <View style={styles.subscribeContainer}>
        <Text style={styles.subscribeTitle}>No Active Subscription</Text>
        <Text style={styles.subscribeText}>
          Subscribe to a meal plan to start planning your meals
        </Text>
        <Button
          title="Subscribe Now"
          onPress={() => router.push('/subscription')}
          style={styles.subscribeButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Meal Plan</Text>
          <Text style={styles.subtitle}>
            {subscription.startDate} to {subscription.endDate}
          </Text>
        </View>
        <View style={styles.mealsRemainingBadge}>
          <Text style={styles.mealsRemainingText}>
            {subscription.mealsRemaining} meals remaining
          </Text>
        </View>
      </View>

      <ScrollView 
        style={styles.mealsContainer}
        contentContainerStyle={styles.mealsContent}
        showsVerticalScrollIndicator={false}
      >
        {groupedMeals.length > 0 ? (
          groupedMeals.map((dayPlan) => (
            <View key={dayPlan.date} style={styles.dayContainer}>
              <Text style={styles.dateHeader}>
                {new Date(dayPlan.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
              {dayPlan.meals.map((mealPlan: any) => {
                const meal = getMealById(mealPlan.id);
                if (!meal) return null;
                
                return (
                  <PlannedMealCard
                    key={`${dayPlan.date}-${mealPlan.mealTime}`}
                    meal={meal}
                    mealTime={mealPlan.mealTime}
                    date={dayPlan.date}
                    onRemove={() => handleRemoveMeal(dayPlan.date, mealPlan.mealTime)}
                    onSwap={() => handleSwapMeal(dayPlan.date, mealPlan.mealTime)}
                  />
                );
              })}
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No meals planned yet</Text>
            <Text style={styles.emptySubtext}>
              Browse meals and add them to your plan
            </Text>
            <Button
              title="Browse Meals"
              onPress={() => router.push('/meals')}
              style={styles.browseButton}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textLight,
  },
  mealsRemainingBadge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  mealsRemainingText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.medium,
  },
  mealsContainer: {
    flex: 1,
  },
  mealsContent: {
    padding: theme.spacing.md,
  },
  dayContainer: {
    marginBottom: theme.spacing.lg,
  },
  dateHeader: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  emptySubtext: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  browseButton: {
    minWidth: 150,
  },
  subscribeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  subscribeTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subscribeText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  subscribeButton: {
    minWidth: 200,
  },
});