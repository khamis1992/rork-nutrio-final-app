import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useGymsStore } from '@/store/gymsStore';
import { GymCard } from '@/components/GymCard';
import { Button } from '@/components/Button';

export default function GymsScreen() {
  const router = useRouter();
  const { subscription } = useSubscriptionStore();
  const { gyms, isLoading, error, fetchGyms } = useGymsStore();

  useEffect(() => {
    fetchGyms();
  }, []);

  const handleGymPress = (gymId: string) => {
    if (!subscription.active || !subscription.gymAccess) {
      Alert.alert(
        "Gym Access Required",
        "You need a subscription with gym access to view gym details",
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

    // In a real app, this would navigate to gym details
    Alert.alert(
      "Gym Access",
      "You have access to this gym. Show this screen at the reception desk.",
      [{ text: "OK" }]
    );
  };

  if (!subscription.active) {
    return (
      <View style={styles.subscribeContainer}>
        <Text style={styles.subscribeTitle}>No Active Subscription</Text>
        <Text style={styles.subscribeText}>
          Subscribe to a plan with gym access to view available gyms
        </Text>
        <Button
          title="Subscribe Now"
          onPress={() => router.push('/subscription')}
          style={styles.subscribeButton}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading gyms...</Text>
      </View>
    );
  }

  if (error && gyms.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Unable to Load Gyms</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Try Again"
          onPress={fetchGyms}
          style={styles.retryButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Partner Gyms</Text>
        <Text style={styles.subtitle}>
          {subscription.gymAccess 
            ? "Your subscription includes access to these gyms" 
            : "Upgrade your subscription to access these gyms"}
        </Text>
      </View>

      {!subscription.gymAccess && (
        <View style={styles.upgradeContainer}>
          <Text style={styles.upgradeText}>
            Add gym access to your current subscription
          </Text>
          <Button
            title="Upgrade Plan"
            onPress={() => router.push('/subscription')}
            style={styles.upgradeButton}
          />
        </View>
      )}

      <ScrollView 
        style={styles.gymsContainer}
        contentContainerStyle={styles.gymsContent}
        showsVerticalScrollIndicator={false}
      >
        {gyms.map((gym) => (
          <GymCard
            key={gym.id}
            gym={{
              id: gym.id,
              name: gym.name,
              image: gym.image_url,
              logo: gym.logo_url,
              address: gym.address,
              distance: gym.distance,
              rating: gym.rating,
              amenities: gym.amenities,
            }}
            isAccessible={subscription.gymAccess}
            onPress={() => handleGymPress(gym.id)}
          />
        ))}
        
        {gyms.length === 0 && !isLoading && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Gyms Available</Text>
            <Text style={styles.emptyText}>
              Check back later for partner gym locations
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
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textLight,
  },
  upgradeContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    margin: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...theme.shadows.md,
  },
  upgradeText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.md,
  },
  upgradeButton: {
    minWidth: 120,
  },
  gymsContainer: {
    flex: 1,
  },
  gymsContent: {
    padding: theme.spacing.md,
  },
  subscribeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  subscribeTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subscribeText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  subscribeButton: {
    minWidth: 200,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textLight,
    marginTop: theme.spacing.md,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  errorTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  errorText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  retryButton: {
    minWidth: 120,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
});