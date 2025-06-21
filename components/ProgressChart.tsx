import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { theme } from '@/constants/theme';

interface ProgressChartProps {
  data: {
    date: string;
    calories: number;
  }[];
  goal?: number;
}

export const ProgressChart = ({ data, goal }: ProgressChartProps) => {
  const maxValue = Math.max(...data.map((item) => item.calories), goal || 0);
  const chartHeight = 150;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Calories</Text>
      <View style={styles.chartContainer}>
        {goal && (
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
            const barHeight = (item.calories / maxValue) * chartHeight;
            const isToday = index === data.length - 1;
            
            return (
              <View key={item.date} style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: isToday
                        ? theme.colors.primary
                        : theme.colors.primaryLight,
                    },
                  ]}
                />
                <Text style={styles.dateLabel}>{formatDate(item.date)}</Text>
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
  bar: {
    width: 20,
    borderRadius: theme.borderRadius.sm,
  },
  dateLabel: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textLight,
  },
});