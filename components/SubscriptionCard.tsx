import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { theme } from '@/constants/theme';
import { SubscriptionStatus } from '@/store/subscriptionStore';

interface SubscriptionCardProps {
  subscription: SubscriptionStatus;
}

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (!subscription.active) {
    return (
      <View style={styles.inactiveContainer}>
        <Text style={styles.inactiveTitle}>No Active Subscription</Text>
        <Text style={styles.inactiveSubtitle}>
          Subscribe to get healthy meals delivered to your door
        </Text>
        <View style={styles.subscribeButton}>
          <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{subscription.plan?.name}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Active</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Start Date</Text>
          <Text style={styles.infoValue}>{formatDate(subscription.startDate)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>End Date</Text>
          <Text style={styles.infoValue}>{formatDate(subscription.endDate)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Meals Remaining</Text>
          <Text style={styles.infoValue}>{subscription.mealsRemaining}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View
          style={[
            styles.gymAccessBadge,
            {
              backgroundColor: subscription.gymAccess
                ? theme.colors.primaryLight
                : theme.colors.grayLight,
            },
          ]}
        >
          <Text
            style={[
              styles.gymAccessText,
              {
                color: subscription.gymAccess
                  ? theme.colors.primary
                  : theme.colors.textLight,
              },
            ]}
          >
            {subscription.gymAccess ? 'Gym Access Included' : 'No Gym Access'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
  },
  badge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  badgeText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.medium,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  infoValue: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  gymAccessBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  gymAccessText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.medium,
  },
  inactiveContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  inactiveTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  inactiveSubtitle: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subscribeButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  subscribeButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
  },
});