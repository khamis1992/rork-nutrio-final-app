import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl } from 'react-native';
import { theme } from '@/constants/theme';
import { useUserStore } from '@/store/userStore';
import { NutritionSummary } from '@/components/NutritionSummary';
import { ProgressChart } from '@/components/ProgressChart';

export default function ProgressScreen() {
  const { user, fetchNutritionProgress, isLoading, error } = useUserStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchNutritionProgress();
    } catch (error) {
      console.error('Error refreshing progress:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchNutritionProgress]);

  useEffect(() => {
    // Fetch latest progress when screen loads
    if (user) {
      fetchNutritionProgress();
    }
  }, [user, fetchNutritionProgress]);

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No data available</Text>
        <Text style={styles.emptySubtext}>
          Log in to track your nutrition progress
        </Text>
      </View>
    );
  }

  // Get today's progress
  const today = new Date().toISOString().split('T')[0];
  const todayProgress = user.progress.find(p => p.date === today) || {
    date: today,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };

  // Calculate weekly totals and averages
  const weeklyTotals = user.progress.reduce(
    (totals, day) => ({
      calories: totals.calories + day.calories,
      protein: totals.protein + day.protein,
      carbs: totals.carbs + day.carbs,
      fat: totals.fat + day.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const daysWithData = user.progress.filter(day => day.calories > 0).length;
  const weeklyAverages = {
    calories: daysWithData > 0 ? Math.round(weeklyTotals.calories / daysWithData) : 0,
    protein: daysWithData > 0 ? Math.round(weeklyTotals.protein / daysWithData) : 0,
    carbs: daysWithData > 0 ? Math.round(weeklyTotals.carbs / daysWithData) : 0,
    fat: daysWithData > 0 ? Math.round(weeklyTotals.fat / daysWithData) : 0,
  };

  // Calculate goal completion percentages
  const goalCompletion = {
    calories: user.dailyGoals.calories > 0 ? Math.round((weeklyAverages.calories / user.dailyGoals.calories) * 100) : 0,
    protein: user.dailyGoals.protein > 0 ? Math.round((weeklyAverages.protein / user.dailyGoals.protein) * 100) : 0,
    carbs: user.dailyGoals.carbs > 0 ? Math.round((weeklyAverages.carbs / user.dailyGoals.carbs) * 100) : 0,
    fat: user.dailyGoals.fat > 0 ? Math.round((weeklyAverages.fat / user.dailyGoals.fat) * 100) : 0,
  };

  const hasAnyData = user.progress.some(day => day.calories > 0);

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Nutrition Progress</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading data: {error}</Text>
        </View>
      )}

      {hasAnyData && (
        <ProgressChart 
          data={user.progress.map(day => ({ 
            date: day.date, 
            calories: day.calories 
          }))} 
          goal={user.dailyGoals.calories}
        />
      )}

      <View style={styles.summaryContainer}>
        <Text style={styles.sectionTitle}>Today's Nutrition</Text>
        <NutritionSummary
          calories={todayProgress.calories}
          protein={todayProgress.protein}
          carbs={todayProgress.carbs}
          fat={todayProgress.fat}
          caloriesGoal={user.dailyGoals.calories}
          proteinGoal={user.dailyGoals.protein}
          carbsGoal={user.dailyGoals.carbs}
          fatGoal={user.dailyGoals.fat}
        />
      </View>

      {hasAnyData && (
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Weekly Stats (Last 7 Days)</Text>
          
          <View style={styles.statsCard}>
            <View style={styles.trackingInfo}>
              <Text style={styles.trackingText}>
                You've logged {daysWithData} out of 7 days this week
              </Text>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Avg. Calories</Text>
                <Text style={styles.statValue}>{weeklyAverages.calories}</Text>
                <Text style={[
                  styles.statPercentage,
                  goalCompletion.calories >= 90 ? styles.goodStat : 
                  goalCompletion.calories >= 70 ? styles.okStat : styles.badStat
                ]}>
                  {goalCompletion.calories}% of goal
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Avg. Protein</Text>
                <Text style={styles.statValue}>{weeklyAverages.protein}g</Text>
                <Text style={[
                  styles.statPercentage,
                  goalCompletion.protein >= 90 ? styles.goodStat : 
                  goalCompletion.protein >= 70 ? styles.okStat : styles.badStat
                ]}>
                  {goalCompletion.protein}% of goal
                </Text>
              </View>
            </View>
            
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Avg. Carbs</Text>
                <Text style={styles.statValue}>{weeklyAverages.carbs}g</Text>
                <Text style={[
                  styles.statPercentage,
                  goalCompletion.carbs >= 90 ? styles.goodStat : 
                  goalCompletion.carbs >= 70 ? styles.okStat : styles.badStat
                ]}>
                  {goalCompletion.carbs}% of goal
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Avg. Fat</Text>
                <Text style={styles.statValue}>{weeklyAverages.fat}g</Text>
                <Text style={[
                  styles.statPercentage,
                  goalCompletion.fat >= 90 ? styles.goodStat : 
                  goalCompletion.fat >= 70 ? styles.okStat : styles.badStat
                ]}>
                  {goalCompletion.fat}% of goal
                </Text>
              </View>
            </View>

            <View style={styles.weeklyTotalsContainer}>
              <Text style={styles.weeklyTotalsTitle}>Weekly Totals</Text>
              <View style={styles.weeklyTotalsRow}>
                <View style={styles.weeklyTotalItem}>
                  <Text style={styles.weeklyTotalValue}>{weeklyTotals.calories}</Text>
                  <Text style={styles.weeklyTotalLabel}>Calories</Text>
                </View>
                <View style={styles.weeklyTotalItem}>
                  <Text style={styles.weeklyTotalValue}>{weeklyTotals.protein}g</Text>
                  <Text style={styles.weeklyTotalLabel}>Protein</Text>
                </View>
                <View style={styles.weeklyTotalItem}>
                  <Text style={styles.weeklyTotalValue}>{weeklyTotals.carbs}g</Text>
                  <Text style={styles.weeklyTotalLabel}>Carbs</Text>
                </View>
                <View style={styles.weeklyTotalItem}>
                  <Text style={styles.weeklyTotalValue}>{weeklyTotals.fat}g</Text>
                  <Text style={styles.weeklyTotalLabel}>Fat</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      {!hasAnyData && (
        <View style={styles.emptyProgressContainer}>
          <Text style={styles.emptyProgressText}>No nutrition data yet</Text>
          <Text style={styles.emptyProgressSubtext}>
            Start logging meals to see your progress here
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  errorContainer: {
    backgroundColor: theme.colors.error + '20',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSizes.sm,
    textAlign: 'center',
  },
  summaryContainer: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  statsContainer: {
    marginBottom: theme.spacing.xl,
  },
  statsCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.md,
  },
  trackingInfo: {
    backgroundColor: theme.colors.primaryLight + '20',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  trackingText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.primary,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeights.medium,
  },
  statRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  statItem: {
    flex: 1,
    padding: theme.spacing.sm,
  },
  statLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statPercentage: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
  },
  goodStat: {
    color: theme.colors.success,
  },
  okStat: {
    color: theme.colors.warning,
  },
  badStat: {
    color: theme.colors.error,
  },
  weeklyTotalsContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  weeklyTotalsTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  weeklyTotalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weeklyTotalItem: {
    alignItems: 'center',
  },
  weeklyTotalValue: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  weeklyTotalLabel: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textLight,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  emptyProgressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyProgressText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  emptyProgressSubtext: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
});