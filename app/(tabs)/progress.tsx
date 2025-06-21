import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { theme } from '@/constants/theme';
import { useUserStore } from '@/store/userStore';
import { NutritionSummary } from '@/components/NutritionSummary';
import { ProgressChart } from '@/components/ProgressChart';

export default function ProgressScreen() {
  const { user } = useUserStore();

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
  const todayProgress = user.progress[user.progress.length - 1];

  // Calculate weekly averages
  const weeklyAverages = {
    calories: Math.round(
      user.progress.reduce((sum, day) => sum + day.calories, 0) / user.progress.length
    ),
    protein: Math.round(
      user.progress.reduce((sum, day) => sum + day.protein, 0) / user.progress.length
    ),
    carbs: Math.round(
      user.progress.reduce((sum, day) => sum + day.carbs, 0) / user.progress.length
    ),
    fat: Math.round(
      user.progress.reduce((sum, day) => sum + day.fat, 0) / user.progress.length
    ),
  };

  // Calculate goal completion percentages
  const goalCompletion = {
    calories: Math.round((weeklyAverages.calories / user.dailyGoals.calories) * 100),
    protein: Math.round((weeklyAverages.protein / user.dailyGoals.protein) * 100),
    carbs: Math.round((weeklyAverages.carbs / user.dailyGoals.carbs) * 100),
    fat: Math.round((weeklyAverages.fat / user.dailyGoals.fat) * 100),
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Nutrition Progress</Text>

      <ProgressChart 
        data={user.progress.map(day => ({ 
          date: day.date, 
          calories: day.calories 
        }))} 
        goal={user.dailyGoals.calories}
      />

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

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Weekly Stats</Text>
        
        <View style={styles.statsCard}>
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
          
          <View style={styles.streakContainer}>
            <Text style={styles.streakLabel}>Current Streak</Text>
            <Text style={styles.streakValue}>{user.progress.length} days</Text>
          </View>
        </View>
      </View>
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
  streakContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
    alignItems: 'center',
  },
  streakLabel: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  streakValue: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.primary,
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
});