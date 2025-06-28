import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { plans, Plan, mockSubscription } from '@/mocks/plans';
import { supabase } from '@/lib/supabase';
import { useUserStore } from './userStore';

export interface SubscriptionStatus {
  active: boolean;
  plan: Plan | null;
  startDate: string | null;
  endDate: string | null;
  gymAccess: boolean;
  mealsRemaining: number;
}

interface SubscriptionState {
  plans: Plan[];
  subscription: SubscriptionStatus;
  isLoading: boolean;
  error: string | null;
  fetchPlans: () => Promise<void>;
  fetchSubscription: () => Promise<void>;
  subscribe: (planId: string, withGymAccess: boolean) => Promise<void>;
  cancelSubscription: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      plans: [],
      subscription: {
        active: false,
        plan: null,
        startDate: null,
        endDate: null,
        gymAccess: false,
        mealsRemaining: 0,
      },
      isLoading: false,
      error: null,

      fetchPlans: async () => {
        try {
          // Use mock data for plans since they're static
          set({ plans, error: null });
        } catch (error: any) {
          console.error('Error fetching plans:', error);
          set({ error: error.message || 'Failed to fetch plans' });
        }
      },

      fetchSubscription: async () => {
        const { supabaseUser, isAuthenticated } = useUserStore.getState();
        
        if (!isAuthenticated || !supabaseUser) {
          // Use mock subscription for demo when not authenticated
          set({ subscription: mockSubscription, error: null });
          return;
        }

        set({ isLoading: true, error: null });
        try {
          // Ensure plans are loaded
          const currentPlans = get().plans;
          if (currentPlans.length === 0) {
            await get().fetchPlans();
          }

          const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', supabaseUser.id)
            .eq('active', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (error && error.code !== 'PGRST116') {
            throw error;
          }

          if (data) {
            // Find the plan by ID from our loaded plans
            const currentPlans = get().plans;
            const plan = currentPlans.find(p => p.id === data.plan_id) || null;
            
            // Format dates for display
            const startDate = data.start_date ? new Date(data.start_date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            }) : null;
            
            const endDate = data.end_date ? new Date(data.end_date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            }) : null;

            set({
              subscription: {
                active: data.active,
                plan: plan,
                startDate: startDate,
                endDate: endDate,
                gymAccess: data.gym_access,
                mealsRemaining: data.meals_remaining,
              },
              error: null,
            });
          } else {
            set({
              subscription: {
                active: false,
                plan: null,
                startDate: null,
                endDate: null,
                gymAccess: false,
                mealsRemaining: 0,
              },
              error: null,
            });
          }
        } catch (error: any) {
          console.error('Error fetching subscription:', error);
          set({ error: error.message || 'Failed to fetch subscription' });
          // Fall back to mock subscription on error for demo purposes
          set({ subscription: mockSubscription });
        } finally {
          set({ isLoading: false });
        }
      },

      subscribe: async (planId, withGymAccess) => {
        const { supabaseUser, isAuthenticated } = useUserStore.getState();
        if (!isAuthenticated || !supabaseUser) throw new Error('User not authenticated');

        set({ isLoading: true, error: null });
        try {
          const selectedPlan = get().plans.find((plan) => plan.id === planId);
          if (!selectedPlan) {
            throw new Error('Plan not found');
          }

          // Calculate dates based on plan duration
          const startDate = new Date();
          const endDate = new Date();

          switch (selectedPlan.duration) {
            case 'daily':
              endDate.setDate(endDate.getDate() + 1);
              break;
            case 'weekly':
              endDate.setDate(endDate.getDate() + 7);
              break;
            case 'monthly':
              endDate.setMonth(endDate.getMonth() + 1);
              break;
          }

          // Calculate meals remaining based on plan
          const mealsRemaining = selectedPlan.duration === 'daily' ? 3 : 
                                selectedPlan.duration === 'weekly' ? 21 : 90;

          // Cancel any existing active subscription
          await supabase
            .from('subscriptions')
            .update({ active: false })
            .eq('user_id', supabaseUser.id)
            .eq('active', true);

          // Create new subscription
          const { error } = await supabase
            .from('subscriptions')
            .insert({
              user_id: supabaseUser.id,
              plan_id: selectedPlan.id,
              plan_name: selectedPlan.name,
              start_date: startDate.toISOString().split('T')[0],
              end_date: endDate.toISOString().split('T')[0],
              gym_access: withGymAccess,
              meals_remaining: mealsRemaining,
              active: true,
            });

          if (error) throw error;

          // Fetch fresh data from server
          await get().fetchSubscription();
        } catch (error: any) {
          console.error('Error subscribing:', error);
          set({ error: error.message || 'Failed to create subscription' });
          throw new Error(error.message || 'Failed to create subscription');
        } finally {
          set({ isLoading: false });
        }
      },

      cancelSubscription: async () => {
        const { supabaseUser, isAuthenticated } = useUserStore.getState();
        if (!isAuthenticated || !supabaseUser) throw new Error('User not authenticated');

        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase
            .from('subscriptions')
            .update({ active: false })
            .eq('user_id', supabaseUser.id)
            .eq('active', true);

          if (error) throw error;

          set({
            subscription: {
              active: false,
              plan: null,
              startDate: null,
              endDate: null,
              gymAccess: false,
              mealsRemaining: 0,
            },
            error: null,
          });
        } catch (error: any) {
          console.error('Error canceling subscription:', error);
          set({ error: error.message || 'Failed to cancel subscription' });
          throw new Error(error.message || 'Failed to cancel subscription');
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'nutrio-subscription-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        plans: state.plans,
      }),
    }
  )
);