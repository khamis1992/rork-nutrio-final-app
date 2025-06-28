import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';

interface ProgressChartProps {
  data: {
    date: string;
    calories: number;
  }[];
  goal?: number;
}

export const ProgressChart = ({ data, goal }: ProgressChartProps) => {
  const maxValue = Math.max(...data.map((item) => item.calories), goal || 0, 100); // Minimum scale of 100
  const chartHeight = 150;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    if (dateString === today) {
      return 'Today';
    } else if (dateString === yesterdayString) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3);
    }
  };

  const hasData = data.some(item => item.calories > 0);

  if (!hasData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Weekly Calories</Text>
        <View style={styles.emptyChart}>
          <Text style={styles.emptyText}>No data to display</Text>
          <Text style={styles.emptySubtext}>Start logging meals to see your progress</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Calories</Text>
      <View style={styles.chartContainer}>
        {goal && goal > 0 && (
          <View
            style={[
              styles.goalLine,
              {
                top: chartHeight - (goal / maxValue) * chartHeight,
              },
            ]}
          >
            <Text style={styles.goalText}>Goal: {goal} cal</Text>
          </View>
        )}
        <View style={styles.barsContainer}>
          {data.map((item, index) => {
            const barHeight = Math.max((item.calories / maxValue) * chartHeight, 2); // Minimum height of 2
            const today = new Date().toISOString().split('T')[0];
            const isToday = item.date === today;
            const hasCalories = item.calories > 0;
            
            return (
              <View key={item.date} style={styles.barWrapper}>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        backgroundColor: !hasCalories 
                          ? theme.colors.grayLight
                          : isToday
                          ? theme.colors.primary
                          : theme.colors.primaryLight,
                        opacity: hasCalories ? 1 : 0.5,
                      },
                    ]}
                  />
                  {hasCalories && (
                    <Text style={styles.calorieValue}>{item.calories}</Text>
                  )}
                </View>
                <Text style={[
                  styles.dateLabel,
                  isToday && styles.todayLabel
                ]}>
                  {formatDate(item.date)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  chartContainer: {
    height: 180,
    position: 'relative',
  },
  emptyChart: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.grayLight + '30',
    borderRadius: theme.borderRadius.md,
  },
  emptyText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  emptySubtext: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  goalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: theme.colors.primary,
    borderStyle: 'dashed',
    zIndex: 1,
  },
  goalText: {
    position: 'absolute',
    right: 0,
    top: -18,
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.medium,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.xs,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    paddingTop: theme.spacing.md,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 150,
    position: 'relative',
  },
  bar: {
    width: 20,
    borderRadius: theme.borderRadius.sm,
    minHeight: 2,
  },
  calorieValue: {
    position: 'absolute',
    top: -20,
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeights.medium,
  },
  dateLabel: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textLight,
  },
  todayLabel: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.medium,
  },
});