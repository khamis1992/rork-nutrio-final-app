import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Pressable } from 'react-native';
import { theme } from '@/constants/theme';
import { restaurants } from '@/mocks/meals';

interface RestaurantCarouselProps {
  title: string;
  onPressItem?: (id: string) => void;
}

export const RestaurantCarousel = ({
  title,
  onPressItem,
}: RestaurantCarouselProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {restaurants.map((restaurant) => (
          <Pressable
            key={restaurant.id}
            style={styles.restaurantItem}
            onPress={() => onPressItem && onPressItem(restaurant.id)}
          >
            <Image source={{ uri: restaurant.logo }} style={styles.logo} />
            <Text style={styles.name} numberOfLines={1}>
              {restaurant.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
  },
  restaurantItem: {
    alignItems: 'center',
    width: 80,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.xs,
    ...theme.shadows.sm,
  },
  name: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
});