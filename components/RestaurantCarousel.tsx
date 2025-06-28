import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { theme } from '@/constants/theme';
import { restaurants } from '@/mocks/restaurants';
import { RestaurantCard } from './RestaurantCard';

interface RestaurantCarouselProps {
  title: string;
  onPressItem?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

export const RestaurantCarousel = ({
  title,
  onPressItem,
  onToggleFavorite,
}: RestaurantCarouselProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.viewAll}>View All</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onPress={() => onPressItem && onPressItem(restaurant.id)}
            onToggleFavorite={() => onToggleFavorite && onToggleFavorite(restaurant.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
  },
  viewAll: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.medium,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
  },
});