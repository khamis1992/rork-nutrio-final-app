import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { useUserStore } from '@/store/userStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { Button } from '@/components/Button';
import { LogOut, Settings, CreditCard, Award, Bell, HelpCircle } from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useUserStore();
  const { subscription, cancelSubscription } = useSubscriptionStore();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: () => {
            logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      "Cancel Subscription",
      "Are you sure you want to cancel your subscription?",
      [
        {
          text: "No",
          style: "cancel"
        },
        { 
          text: "Yes", 
          onPress: async () => {
            try {
              await cancelSubscription();
              Alert.alert("Success", "Your subscription has been canceled");
            } catch (error) {
              Alert.alert("Error", "Failed to cancel subscription");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.loginContainer}>
        <Text style={styles.loginTitle}>Not Logged In</Text>
        <Text style={styles.loginText}>
          Please log in to access your profile
        </Text>
        <Button
          title="Login"
          onPress={() => router.push('/login')}
          style={styles.loginButton}
        />
        <Button
          title="Sign Up"
          onPress={() => router.push('/signup')}
          variant="outline"
          style={styles.signupButton}
        />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileHeader}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        <View style={styles.card}>
          {subscription.active ? (
            <>
              <View style={styles.subscriptionInfo}>
                <Text style={styles.planName}>{subscription.plan?.name}</Text>
                <Text style={styles.planDates}>
                  {subscription.startDate} to {subscription.endDate}
                </Text>
                <View style={styles.planFeatures}>
                  <Text style={styles.planFeature}>• {subscription.mealsRemaining} meals remaining</Text>
                  <Text style={styles.planFeature}>• {subscription.gymAccess ? 'Gym access included' : 'No gym access'}</Text>
                </View>
              </View>
              <View style={styles.subscriptionActions}>
                <Button
                  title="Manage Plan"
                  onPress={() => router.push('/my-plan')}
                  size="small"
                  style={styles.manageButton}
                />
                <Button
                  title="Cancel"
                  onPress={handleCancelSubscription}
                  variant="outline"
                  size="small"
                  style={styles.cancelButton}
                />
              </View>
            </>
          ) : (
            <View style={styles.noSubscription}>
              <Text style={styles.noSubscriptionText}>No active subscription</Text>
              <Button
                title="Subscribe Now"
                onPress={() => router.push('/subscription')}
                size="small"
                style={styles.subscribeButton}
              />
            </View>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.card}>
          <Pressable style={styles.menuItem}>
            <Settings size={20} color={theme.colors.text} />
            <Text style={styles.menuItemText}>Account Settings</Text>
          </Pressable>
          <Pressable style={styles.menuItem}>
            <CreditCard size={20} color={theme.colors.text} />
            <Text style={styles.menuItemText}>Payment Methods</Text>
          </Pressable>
          <Pressable style={styles.menuItem}>
            <Bell size={20} color={theme.colors.text} />
            <Text style={styles.menuItemText}>Notifications</Text>
          </Pressable>
          <Pressable style={styles.menuItem}>
            <Award size={20} color={theme.colors.text} />
            <Text style={styles.menuItemText}>Achievements</Text>
          </Pressable>
          <Pressable style={styles.menuItem}>
            <HelpCircle size={20} color={theme.colors.text} />
            <Text style={styles.menuItemText}>Help & Support</Text>
          </Pressable>
        </View>
      </View>

      <Button
        title="Logout"
        onPress={handleLogout}
        variant="outline"
        style={styles.logoutButton}
        textStyle={styles.logoutButtonText}
        icon={<LogOut size={18} color={theme.colors.error} />}
      />
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  name: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  email: {
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
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.md,
  },
  subscriptionInfo: {
    marginBottom: theme.spacing.md,
  },
  planName: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  planDates: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.sm,
  },
  planFeatures: {
    marginBottom: theme.spacing.sm,
  },
  planFeature: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subscriptionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  manageButton: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  cancelButton: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  noSubscription: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  noSubscriptionText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.md,
  },
  subscribeButton: {
    minWidth: 150,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuItemText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
  logoutButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xxl,
    borderColor: theme.colors.error,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  logoutButtonText: {
    color: theme.colors.error,
  },
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  loginTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  loginText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  loginButton: {
    minWidth: 200,
    marginBottom: theme.spacing.md,
  },
  signupButton: {
    minWidth: 200,
  },
});