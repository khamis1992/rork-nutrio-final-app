import React from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { theme } from '@/constants/theme';
import { Restaurant } from '@/mocks/restaurants';
import { Star, Heart } from 'lucide-react-native';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress?: () => void;
  onToggleFavorite?: () => void;
}

export const RestaurantCard = ({ 
  restaurant, 
  onPress, 
  onToggleFavorite 
}: RestaurantCardProps) => {
  const getTagColor = (color: string) => {
    switch (color) {
      case 'red':
        return { backgroundColor: '#FEE2E2', color: '#DC2626' };
      case 'blue':
        return { backgroundColor: '#DBEAFE', color: '#2563EB' };
      case 'yellow':
        return { backgroundColor: '#FEF3C7', color: '#D97706' };
      case 'green':
        return { backgroundColor: '#D1FAE5', color: '#059669' };
      default:
        return { backgroundColor: theme.colors.grayLight, color: theme.colors.textLight };
    }
  };

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]} 
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: restaurant.image }} style={styles.image} />
        <Pressable 
          style={styles.favoriteButton} 
          onPress={(e) => {
            e.stopPropagation();
            onToggleFavorite?.();
          }}
        >
          <Heart 
            size={18} 
            color={restaurant.isFavorite ? '#DC2626' : theme.colors.white}
            fill={restaurant.isFavorite ? '#DC2626' : 'transparent'}
          />
        </Pressable>
        <View style={styles.logoContainer}>
          <Image source={{ uri: restaurant.logo }} style={styles.logo} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
        
        <View style={styles.ratingRow}>
          <Star size={14} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.rating}>{restaurant.rating}</Text>
          <Text style={styles.cuisineType}>• {restaurant.cuisineType}</Text>
        </View>

        <View style={styles.tagsContainer}>
          {restaurant.tags.slice(0, 2).map((tag, index) => {
            const tagStyle = getTagColor(tag.color);
            return (
              <View 
                key={index} 
                style={[styles.tag, { backgroundColor: tagStyle.backgroundColor }]}
              >
                <Text style={[styles.tagText, { color: tagStyle.color }]}>
                  {tag.text}
                </Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.deliveryTime}>{restaurant.deliveryTime}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginRight: theme.spacing.md,
    ...theme.shadows.md,
  },
  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    position: 'relative',
    height: 140,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    position: 'absolute',
    bottom: -20,
    left: theme.spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  content: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  name: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  rating: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
  },
  cuisineType: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textLight,
    marginLeft: theme.spacing.xs,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  tag: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  tagText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.medium,
  },
  deliveryTime: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textLight,
    fontWeight: theme.typography.fontWeights.medium,
  },
});