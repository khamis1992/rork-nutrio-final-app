import React from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { theme } from '@/constants/theme';
import { Meal } from '@/mocks/meals';
import { X } from 'lucide-react-native';

interface PlannedMealCardProps {
  meal: Meal;
  mealTime: string;
  date: string;
  onRemove: () => void;
  onSwap: () => void;
}

export const PlannedMealCard = ({
  meal,
  mealTime,
  date,
  onRemove,
  onSwap,
}: PlannedMealCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mealTime}>{mealTime}</Text>
        <Text style={styles.date}>{formatDate(date)}</Text>
      </View>

      <View style={styles.content}>
        <Image source={{ uri: meal.image }} style={styles.image} />
        <View style={styles.mealInfo}>
          <Text style={styles.mealName}>{meal.name}</Text>
          <View style={styles.restaurantRow}>
            <Image source={{ uri: meal.restaurantLogo }} style={styles.restaurantLogo} />
            <Text style={styles.restaurantName}>{meal.restaurant}</Text>
          </View>
          <Text style={styles.calories}>{meal.calories} calories</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.swapButton} onPress={onSwap}>
          <Text style={styles.swapButtonText}>Swap Meal</Text>
        </Pressable>
        <Pressable style={styles.removeButton} onPress={onRemove}>
          <X size={16} color={theme.colors.textLight} />
        </Pressable>
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
    marginBottom: theme.spacing.sm,
  },
  mealTime: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
  },
  date: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textLight,
  },
  content: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.md,
  },
  mealInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  mealName: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  restaurantLogo: {
    width: 16,
    height: 16,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.xs,
  },
  restaurantName: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textLight,
  },
  calories: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.primary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  swapButton: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  swapButtonText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.medium,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.grayLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});