import React from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { Meal } from '@/mocks/meals';

interface MealCardProps {
  meal: Meal;
  compact?: boolean;
}

export const MealCard = ({ meal, compact = false }: MealCardProps) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/meal/${meal.id}`);
  };

  if (compact) {
    return (
      <Pressable
        style={styles.compactContainer}
        onPress={handlePress}
      >
        <Image source={{ uri: meal.image }} style={styles.compactImage} />
        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={1}>{meal.name}</Text>
          <Text style={styles.compactCalories}>{meal.calories} cal</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={styles.container}
      onPress={handlePress}
    >
      <Image source={{ uri: meal.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{meal.name}</Text>
        <View style={styles.restaurantRow}>
          <Image source={{ uri: meal.restaurantLogo }} style={styles.restaurantLogo} />
          <Text style={styles.restaurantName}>{meal.restaurant}</Text>
        </View>
        <View style={styles.macrosContainer}>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{meal.calories}</Text>
            <Text style={styles.macroLabel}>Cal</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{meal.protein}g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{meal.carbs}g</Text>
            <Text style={styles.macroLabel}>Carbs</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{meal.fat}g</Text>
            <Text style={styles.macroLabel}>Fat</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  content: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  restaurantLogo: {
    width: 20,
    height: 20,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.xs,
  },
  restaurantName: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textLight,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.sm,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
  },
  macroLabel: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textLight,
  },
  compactContainer: {
    width: 140,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginRight: theme.spacing.md,
    ...theme.shadows.sm,
  },
  compactImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  compactContent: {
    padding: theme.spacing.sm,
  },
  compactTitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  compactCalories: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textLight,
  },
});