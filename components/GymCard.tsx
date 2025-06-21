import React from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { theme } from '@/constants/theme';
import { Gym } from '@/mocks/gyms';
import { Star } from 'lucide-react-native';

interface GymCardProps {
  gym: Gym;
  isAccessible?: boolean;
  onPress?: () => void;
}

export const GymCard = ({ gym, isAccessible = true, onPress }: GymCardProps) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Image source={{ uri: gym.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image source={{ uri: gym.logo }} style={styles.logo} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{gym.name}</Text>
            <View style={styles.ratingContainer}>
              <Star size={14} color={theme.colors.warning} fill={theme.colors.warning} />
              <Text style={styles.rating}>{gym.rating}</Text>
            </View>
          </View>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: isAccessible
                  ? theme.colors.primaryLight
                  : theme.colors.grayLight,
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  color: isAccessible
                    ? theme.colors.primary
                    : theme.colors.textLight,
                },
              ]}
            >
              {isAccessible ? 'Access' : 'No Access'}
            </Text>
          </View>
        </View>

        <Text style={styles.address}>{gym.address}</Text>
        <Text style={styles.distance}>{gym.distance} away</Text>

        <View style={styles.amenitiesContainer}>
          {gym.amenities.slice(0, 3).map((amenity, index) => (
            <View key={index} style={styles.amenityBadge}>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
          {gym.amenities.length > 3 && (
            <Text style={styles.moreAmenities}>+{gym.amenities.length - 3} more</Text>
          )}
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
    height: 150,
    resizeMode: 'cover',
  },
  content: {
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: theme.borderRadius.sm,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textLight,
    marginLeft: theme.spacing.xs,
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  badgeText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.medium,
  },
  address: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  distance: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.md,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  amenityBadge: {
    backgroundColor: theme.colors.grayLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  amenityText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textLight,
  },
  moreAmenities: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.primary,
    alignSelf: 'center',
  },
});