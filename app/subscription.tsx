import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/Button';
import { Check } from 'lucide-react-native';

export default function SubscriptionScreen() {
  const router = useRouter();
  const { plans, subscribe } = useSubscriptionStore();
  const { isAuthenticated } = useUserStore();
  const [selectedPlanId, setSelectedPlanId] = useState('weekly');
  const [includeGymAccess, setIncludeGymAccess] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const selectedPlan = plans.find(plan => plan.id === selectedPlanId);
  
  // Calculate total price
  const gymAccessFee = 19.99;
  const totalPrice = selectedPlan 
    ? (includeGymAccess ? selectedPlan.price + gymAccessFee : selectedPlan.price)
    : 0;

  const handleSubscribe = async () => {
    if (!selectedPlan) return;
    
    if (!isAuthenticated) {
      Alert.alert(
        "Login Required",
        "You need to log in to subscribe to a plan",
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
      await subscribe(selectedPlanId, includeGymAccess);
      
      Alert.alert(
        "Subscription Successful! 🎉",
        `You are now subscribed to the ${selectedPlan.name}${includeGymAccess ? ' with gym access' : ''}`,
        [
          {
            text: "View My Plan",
            onPress: () => router.push('/my-plan')
          },
          {
            text: "Go Home",
            onPress: () => router.push('/')
          }
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Subscription Failed", 
        error.message || "Failed to subscribe. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Choose Your Plan</Text>
      <Text style={styles.subtitle}>
        Select a subscription plan that fits your lifestyle
      </Text>

      <View style={styles.plansContainer}>
        {plans.map((plan) => (
          <Pressable
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlanId === plan.id && styles.selectedPlanCard,
              plan.popular && styles.popularPlanCard,
            ]}
            onPress={() => setSelectedPlanId(plan.id)}
          >
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>Most Popular</Text>
              </View>
            )}
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>${plan.price.toFixed(2)}</Text>
                <Text style={styles.pricePeriod}>
                  /{plan.duration === 'daily' ? 'day' : plan.duration === 'weekly' ? 'week' : 'month'}
                </Text>
              </View>
            </View>
            <Text style={styles.planDescription}>{plan.description}</Text>
            <View style={styles.featuresContainer}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Check size={16} color={theme.colors.primary} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
            {selectedPlanId === plan.id && (
              <View style={styles.selectedIndicator} />
            )}
          </Pressable>
        ))}
      </View>

      <View style={styles.optionsContainer}>
        <View style={styles.optionItem}>
          <View>
            <Text style={styles.optionTitle}>Gym Access</Text>
            <Text style={styles.optionDescription}>
              Access to partner gyms in your area
            </Text>
          </View>
          <View style={styles.optionRight}>
            <Text style={styles.optionPrice}>+$19.99</Text>
            <Switch
              value={includeGymAccess}
              onValueChange={setIncludeGymAccess}
              trackColor={{ false: theme.colors.grayLight, true: theme.colors.primaryLight }}
              thumbColor={includeGymAccess ? theme.colors.primary : theme.colors.gray}
            />
          </View>
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryItemText}>
            {selectedPlan?.name} Subscription
          </Text>
          <Text style={styles.summaryItemPrice}>
            ${selectedPlan?.price.toFixed(2)}
          </Text>
        </View>
        {includeGymAccess && (
          <View style={styles.summaryItem}>
            <Text style={styles.summaryItemText}>Gym Access</Text>
            <Text style={styles.summaryItemPrice}>${gymAccessFee.toFixed(2)}</Text>
          </View>
        )}
        <View style={styles.summaryTotal}>
          <Text style={styles.summaryTotalText}>Total</Text>
          <Text style={styles.summaryTotalPrice}>${totalPrice.toFixed(2)}</Text>
        </View>
      </View>

      <Button
        title={isAuthenticated ? "Subscribe Now" : "Login to Subscribe"}
        onPress={handleSubscribe}
        style={styles.subscribeButton}
        isLoading={isLoading}
      />

      {!isAuthenticated && (
        <View style={styles.loginPrompt}>
          <Text style={styles.loginPromptText}>
            Already have an account?{' '}
            <Text 
              style={styles.loginLink}
              onPress={() => router.push('/login')}
            >
              Log in here
            </Text>
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
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
    marginBottom: theme.spacing.lg,
  },
  plansContainer: {
    marginBottom: theme.spacing.lg,
  },
  planCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    ...theme.shadows.md,
  },
  selectedPlanCard: {
    borderColor: theme.colors.primary,
  },
  popularPlanCard: {
    borderColor: theme.colors.primary,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  popularBadgeText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.medium,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  planName: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.primary,
  },
  pricePeriod: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textLight,
  },
  planDescription: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.md,
  },
  featuresContainer: {
    marginBottom: theme.spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  featureText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 4,
    backgroundColor: theme.colors.primary,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderBottomLeftRadius: theme.borderRadius.lg,
  },
  optionsContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  optionDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textLight,
  },
  optionRight: {
    alignItems: 'flex-end',
  },
  optionPrice: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  summaryContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  summaryTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  summaryItemText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
  },
  summaryItemPrice: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  summaryTotalText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
  },
  summaryTotalPrice: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.primary,
  },
  subscribeButton: {
    marginBottom: theme.spacing.md,
  },
  loginPrompt: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  loginPromptText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textLight,
  },
  loginLink: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.medium,
  },
});