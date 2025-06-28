import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { theme } from '@/constants/theme';
import { useMealsStore } from '@/store/mealsStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useUserStore } from '@/store/userStore';
import { PlannedMealCard } from '@/components/PlannedMealCard';
import { Button } from '@/components/Button';

export default function MyPlanScreen() {
  const router = useRouter();
  const { meals, plannedMeals, getMealById, removeMealFromPlan, fetchPlannedMeals } = useMealsStore();
  const { subscription, fetchSubscription, fetchPlans, isLoading: subscriptionLoading } = useSubscriptionStore();
  const { isAuthenticated } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch data when component mounts or when authentication status changes
  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated) {
        setIsLoading(true);
        try {
          // Ensure plans are loaded first, then fetch subscription and planned meals
          await fetchPlans();
          await Promise.all([
            fetchSubscription(),
            fetchPlannedMeals()
          ]);
        } catch (error) {
          console.error('Error loading plan data:', error);
          Alert.alert('Error', 'Failed to load your plan data. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadData();
  }, [isAuthenticated, fetchPlans, fetchSubscription, fetchPlannedMeals]);

  const onRefresh = React.useCallback(async () => {
    if (!isAuthenticated) return;
    
    setRefreshing(true);
    try {
      await fetchPlans();
      await Promise.all([
        fetchSubscription(),
        fetchPlannedMeals()
      ]);
    } catch (error) {
      console.error('Error refreshing plan data:', error);
      Alert.alert('Error', 'Failed to refresh your plan data. Please try again.');
    } finally {
      setRefreshing(false);
    }
  }, [isAuthenticated, fetchPlans, fetchSubscription, fetchPlannedMeals]);

  // Group planned meals by date and sort by date
  const groupedMeals = plannedMeals
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .filter(dayPlan => {
      // Only show future dates and today
      const planDate = new Date(dayPlan.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return planDate >= today;
    });

  const handleRemoveMeal = async (date: string, mealTime: string) => {
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
          onPress: async () => {
            try {
              await removeMealFromPlan(date, mealTime);
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to remove meal");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleSwapMeal = (date: string, mealTime: string) => {
    // Navigate to meals screen with swap parameters
    router.push({
      pathname: '/(tabs)/meals',
      params: { date, mealTime, action: 'swap' }
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Stack.Screen options={{ title: 'My Plan' }} />
        <View style={styles.subscribeContainer}>
          <Text style={styles.subscribeTitle}>Login Required</Text>
          <Text style={styles.subscribeText}>
            Please log in to view your meal plan
          </Text>
          <Button
            title="Login"
            onPress={() => router.push('/login')}
            style={styles.subscribeButton}
          />
        </View>
      </>
    );
  }

  // Show subscription prompt if no active subscription
  if (!subscription.active && !subscriptionLoading && !isLoading) {
    return (
      <>
        <Stack.Screen options={{ title: 'My Plan' }} />
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
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'My Plan' }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Meal Plan</Text>
            {subscription.active && subscription.plan && (
              <Text style={styles.subtitle}>
                {subscription.plan.name} • {subscription.startDate} to {subscription.endDate}
              </Text>
            )}
          </View>
          {subscription.active && (
            <View style={styles.mealsRemainingBadge}>
              <Text style={styles.mealsRemainingText}>
                {subscription.mealsRemaining} meals left
              </Text>
            </View>
          )}
        </View>

        <ScrollView 
          style={styles.mealsContainer}
          contentContainerStyle={styles.mealsContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {(isLoading || subscriptionLoading) && groupedMeals.length === 0 ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading your meal plan...</Text>
            </View>
          ) : groupedMeals.length > 0 ? (
            groupedMeals.map((dayPlan) => (
              <View key={dayPlan.date} style={styles.dayContainer}>
                <Text style={styles.dateHeader}>
                  {formatDate(dayPlan.date)}
                </Text>
                {dayPlan.meals.map((mealPlan: any) => {
                  const meal = getMealById(mealPlan.id);
                  if (!meal) {
                    return (
                      <View key={`${dayPlan.date}-${mealPlan.mealTime}`} style={styles.missingMealCard}>
                        <Text style={styles.missingMealText}>
                          {mealPlan.mealTime} - Meal not found
                        </Text>
                        <Button
                          title="Remove"
                          onPress={() => handleRemoveMeal(dayPlan.date, mealPlan.mealTime)}
                          variant="outline"
                          size="small"
                        />
                      </View>
                    );
                  }
                  
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
                Browse meals and add them to your plan to get started
              </Text>
              <Button
                title="Browse Meals"
                onPress={() => router.push('/(tabs)/meals')}
                style={styles.browseButton}
              />
            </View>
          )}

          {subscription.active && subscription.plan && (
            <View style={styles.planSummary}>
              <Text style={styles.planSummaryTitle}>Plan Summary</Text>
              <View style={styles.planSummaryRow}>
                <Text style={styles.planSummaryLabel}>Subscription:</Text>
                <Text style={styles.planSummaryValue}>{subscription.plan.name}</Text>
              </View>
              <View style={styles.planSummaryRow}>
                <Text style={styles.planSummaryLabel}>Plan Type:</Text>
                <Text style={styles.planSummaryValue}>
                  {subscription.plan.duration.charAt(0).toUpperCase() + subscription.plan.duration.slice(1)}
                </Text>
              </View>
              <View style={styles.planSummaryRow}>
                <Text style={styles.planSummaryLabel}>Meals Remaining:</Text>
                <Text style={styles.planSummaryValue}>{subscription.mealsRemaining}</Text>
              </View>
              <View style={styles.planSummaryRow}>
                <Text style={styles.planSummaryLabel}>Gym Access:</Text>
                <Text style={styles.planSummaryValue}>
                  {subscription.gymAccess ? 'Included' : 'Not included'}
                </Text>
              </View>
              {subscription.gymAccess && (
                <Button
                  title="View Gyms"
                  onPress={() => router.push('/gyms')}
                  variant="outline"
                  style={styles.gymButton}
                />
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </>
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
    marginTop: theme.spacing.xs,
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  loadingText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textLight,
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
  missingMealCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.error,
    ...theme.shadows.sm,
  },
  missingMealText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.error,
    flex: 1,
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
  planSummary: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg,
    ...theme.shadows.md,
  },
  planSummaryTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  planSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  planSummaryLabel: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textLight,
  },
  planSummaryValue: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
  },
  gymButton: {
    marginTop: theme.spacing.md,
  },
});