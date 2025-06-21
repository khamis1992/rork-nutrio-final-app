import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput } from 'react-native';
import { theme } from '@/constants/theme';
import { useMealsStore } from '@/store/mealsStore';
import { CategoryFilter } from '@/components/CategoryFilter';
import { MealCard } from '@/components/MealCard';
import { Search } from 'lucide-react-native';

export default function MealsScreen() {
  const { meals, selectedCategory, setSelectedCategory } = useMealsStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter meals by category and search query
  const filteredMeals = meals.filter(meal => {
    const matchesCategory = selectedCategory === 'all' || 
      meal.category.some(cat => cat.toLowerCase() === selectedCategory.toLowerCase());
    
    const matchesSearch = searchQuery === '' || 
      meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.restaurant.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color={theme.colors.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search meals or restaurants"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={theme.colors.textLight}
        />
      </View>

      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <ScrollView 
        style={styles.mealsContainer}
        contentContainerStyle={styles.mealsContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredMeals.length > 0 ? (
          filteredMeals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No meals found</Text>
            <Text style={styles.emptySubtext}>
              Try changing your search or category filters
            </Text>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.full,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
  },
  mealsContainer: {
    flex: 1,
  },
  mealsContent: {
    padding: theme.spacing.md,
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
  },
});