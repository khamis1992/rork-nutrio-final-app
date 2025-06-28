import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { useMealsStore } from '@/store/mealsStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/Button';
import { NutritionSummary } from '@/components/NutritionSummary';

export default function MealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getMealById, addMealToPlan, logMealAsEaten } = useMealsStore();
  const { subscription } = useSubscriptionStore();
  const { isAuthenticated } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  const meal = getMealById(id);

  if (!meal) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Meal not found</Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          style={styles.backButton}
        />
      </View>
    );
  }

  const handleAddToPlan = () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Login Required",
        "You need to log in to add meals to your plan",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { 
            text: "Login", 
            onPress: () => router.push('/login')
          }
        ]
      );
      return;
    }

    if (!subscription.active) {
      Alert.alert(
        "Subscription Required",
        "You need an active subscription to add meals to your plan",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { 
            text: "Subscribe", 
            onPress: () => router.push('/subscription')
          }
        ]
      );
      return;
    }

    // Show meal time picker
    Alert.alert(
      "Select Meal Time",
      "When would you like to have this meal?",
      [
        {
          text: "Breakfast",
          onPress: () => selectDate("Breakfast")
        },
        {
          text: "Lunch",
          onPress: () => selectDate("Lunch")
        },
        {
          text: "Dinner",
          onPress: () => selectDate("Dinner")
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };

  const selectDate = async (mealTime: string) => {
    try {
      // For simplicity, we'll just add it to today's plan
      // In a real app, you'd show a date picker
      const today = new Date().toISOString().split('T')[0];
      
      await addMealToPlan(meal.id, today, mealTime);
      
      Alert.alert(
        "Success",
        `${meal.name} added to your plan for ${mealTime}`,
        [
          {
            text: "View Plan",
            onPress: () => router.push('/my-plan')
          },
          {
            text: "OK",
            style: "cancel"
          }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to add meal to plan");
    }
  };

  const handleLogAsEaten = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Login Required",
        "You need to log in to track your nutrition",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { 
            text: "Login", 
            onPress: () => router.push('/login')
          }
        ]
      );
      return;
    }

    setIsLoading(true);
    
    try {
      await logMealAsEaten(meal.id);
      Alert.alert(
        "Meal Logged",
        "This meal has been added to your nutrition log",
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to log meal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: meal.image }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{meal.name}</Text>
          <View style={styles.restaurantRow}>
            <Image source={{ uri: meal.restaurantLogo }} style={styles.restaurantLogo} />
            <Text style={styles.restaurantName}>{meal.restaurant}</Text>
          </View>
        </View>

        <NutritionSummary
          calories={meal.calories}
          protein={meal.protein}
          carbs={meal.carbs}
          fat={meal.fat}
          compact
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{meal.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <View style={styles.ingredientsList}>
            {meal.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.categoryContainer}>
          {meal.category.map((category, index) => (
            <View key={index} style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          ))}
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.price}>${meal.price.toFixed(2)}</Text>
        </View>

        <View style={styles.actions}>
          <Button
            title="Add to Plan"
            onPress={handleAddToPlan}
            style={styles.addButton}
          />
          <Button
            title="Log as Eaten"
            onPress={handleLogAsEaten}
            variant="outline"
            style={styles.logButton}
            isLoading={isLoading}
          />
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
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantLogo: {
    width: 20,
    height: 20,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.xs,
  },
  restaurantName: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textLight,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    lineHeight: 22,
  },
  ingredientsList: {
    marginTop: theme.spacing.xs,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing.sm,
  },
  ingredientText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  categoryBadge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  categoryText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.primary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  priceLabel: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textLight,
    marginRight: theme.spacing.sm,
  },
  price: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.primary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  addButton: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  logButton: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  notFoundText: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    minWidth: 150,
  },
});