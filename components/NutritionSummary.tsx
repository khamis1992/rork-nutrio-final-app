import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';

interface NutritionSummaryProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  caloriesGoal?: number;
  proteinGoal?: number;
  carbsGoal?: number;
  fatGoal?: number;
  compact?: boolean;
}

export const NutritionSummary = ({
  calories,
  protein,
  carbs,
  fat,
  caloriesGoal,
  proteinGoal,
  carbsGoal,
  fatGoal,
  compact = false,
}: NutritionSummaryProps) => {
  const calculatePercentage = (value: number, goal: number) => {
    return Math.min(Math.round((value / goal) * 100), 100);
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactItem}>
          <Text style={styles.compactLabel}>Calories</Text>
          <Text style={styles.compactValue}>{calories}</Text>
          {caloriesGoal && (
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${calculatePercentage(calories, caloriesGoal)}%`,
                    backgroundColor: theme.colors.primary,
                  },
                ]}
              />
            </View>
          )}
        </View>
        <View style={styles.compactRow}>
          <View style={styles.compactItem}>
            <Text style={styles.compactLabel}>Protein</Text>
            <Text style={styles.compactValue}>{protein}g</Text>
            {proteinGoal && (
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${calculatePercentage(protein, proteinGoal)}%`,
                      backgroundColor: theme.colors.info,
                    },
                  ]}
                />
              </View>
            )}
          </View>
          <View style={styles.compactItem}>
            <Text style={styles.compactLabel}>Carbs</Text>
            <Text style={styles.compactValue}>{carbs}g</Text>
            {carbsGoal && (
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${calculatePercentage(carbs, carbsGoal)}%`,
                      backgroundColor: theme.colors.warning,
                    },
                  ]}
                />
              </View>
            )}
          </View>
          <View style={styles.compactItem}>
            <Text style={styles.compactLabel}>Fat</Text>
            <Text style={styles.compactValue}>{fat}g</Text>
            {fatGoal && (
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${calculatePercentage(fat, fatGoal)}%`,
                      backgroundColor: theme.colors.secondary,
                    },
                  ]}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Nutrition</Text>
        {caloriesGoal && (
          <Text style={styles.subtitle}>
            {calories} / {caloriesGoal} cal
          </Text>
        )}
      </View>

      <View style={styles.macrosContainer}>
        <View style={styles.macroItem}>
          <View style={[styles.macroIcon, { backgroundColor: theme.colors.info }]}>
            <Text style={styles.macroIconText}>P</Text>
          </View>
          <View style={styles.macroContent}>
            <View style={styles.macroLabelRow}>
              <Text style={styles.macroLabel}>Protein</Text>
              {proteinGoal && (
                <Text style={styles.macroGoal}>
                  {protein}g / {proteinGoal}g
                </Text>
              )}
            </View>
            {proteinGoal && (
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${calculatePercentage(protein, proteinGoal)}%`,
                      backgroundColor: theme.colors.info,
                    },
                  ]}
                />
              </View>
            )}
          </View>
        </View>

        <View style={styles.macroItem}>
          <View style={[styles.macroIcon, { backgroundColor: theme.colors.warning }]}>
            <Text style={styles.macroIconText}>C</Text>
          </View>
          <View style={styles.macroContent}>
            <View style={styles.macroLabelRow}>
              <Text style={styles.macroLabel}>Carbs</Text>
              {carbsGoal && (
                <Text style={styles.macroGoal}>
                  {carbs}g / {carbsGoal}g
                </Text>
              )}
            </View>
            {carbsGoal && (
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${calculatePercentage(carbs, carbsGoal)}%`,
                      backgroundColor: theme.colors.warning,
                    },
                  ]}
                />
              </View>
            )}
          </View>
        </View>

        <View style={styles.macroItem}>
          <View style={[styles.macroIcon, { backgroundColor: theme.colors.secondary }]}>
            <Text style={styles.macroIconText}>F</Text>
          </View>
          <View style={styles.macroContent}>
            <View style={styles.macroLabelRow}>
              <Text style={styles.macroLabel}>Fat</Text>
              {fatGoal && (
                <Text style={styles.macroGoal}>
                  {fat}g / {fatGoal}g
                </Text>
              )}
            </View>
            {fatGoal && (
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${calculatePercentage(fat, fatGoal)}%`,
                      backgroundColor: theme.colors.secondary,
                    },
                  ]}
                />
              </View>
            )}
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.primary,
  },
  macrosContainer: {
    gap: theme.spacing.md,
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  macroIcon: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  macroIconText: {
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeights.bold,
    fontSize: theme.typography.fontSizes.md,
  },
  macroContent: {
    flex: 1,
  },
  macroLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  macroLabel: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
  },
  macroGoal: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textLight,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: theme.colors.grayLight,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  compactContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  compactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  compactItem: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  compactLabel: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  compactValue: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
});