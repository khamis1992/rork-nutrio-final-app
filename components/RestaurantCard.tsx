import React from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { theme } from '@/constants/theme';
import { Restaurant } from '@/store/restaurantsStore';
import { Star, Heart, Clock, MapPin } from 'lucide-react-native';

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
  // Safely handle null/undefined values
  const rating = restaurant.rating ?? 0;
  const imageUrl = restaurant.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  const logoUrl = restaurant.logo_url || 'https://images.unsplash.com/photo-1581349485608-9469926a8e5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80';

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]} 
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.image} 
        />
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
          <Image 
            source={{ uri: logoUrl }} 
            style={styles.logo} 
          />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{restaurant.name || 'Restaurant'}</Text>
        
        <View style={styles.ratingRow}>
          <Star size={14} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.rating}>{rating.toFixed(1)}</Text>
          {restaurant.cuisine_type && (
            <Text style={styles.cuisineType}>• {restaurant.cuisine_type}</Text>
          )}
        </View>

        <View style={styles.infoRow}>
          {restaurant.delivery_time && (
            <View style={styles.infoItem}>
              <Clock size={12} color={theme.colors.textLight} />
              <Text style={styles.infoText}>{restaurant.delivery_time}</Text>
            </View>
          )}
        </View>
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  infoText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textLight,
    fontWeight: theme.typography.fontWeights.medium,
  },
});