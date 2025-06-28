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

      fetchPlans: async () => {
        set({ isLoading: true });
        try {
          // Use mock data for plans
          set({ plans });
          await get().fetchSubscription();
        } catch (error) {
          console.error('Error fetching plans:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      fetchSubscription: async () => {
        const { supabaseUser, isAuthenticated } = useUserStore.getState();
        
        if (!isAuthenticated || !supabaseUser) {
          // Use mock subscription for demo when not authenticated
          set({ subscription: mockSubscription });
          return;
        }

        try {
          const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', supabaseUser.id)
            .eq('active', true)
            .single();

          if (error && error.code !== 'PGRST116') {
            throw error;
          }

          if (data) {
            const plan = get().plans.find(p => p.id === data.plan_id);
            set({
              subscription: {
                active: data.active,
                plan: plan || null,
                startDate: data.start_date,
                endDate: data.end_date,
                gymAccess: data.gym_access,
                mealsRemaining: data.meals_remaining,
              },
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
            });
          }
        } catch (error) {
          console.error('Error fetching subscription:', error);
          // Fall back to mock subscription on error
          set({ subscription: mockSubscription });
        }
      },

      subscribe: async (planId, withGymAccess) => {
        const { supabaseUser, isAuthenticated } = useUserStore.getState();
        if (!isAuthenticated || !supabaseUser) throw new Error('User not authenticated');

        set({ isLoading: true });
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

          await get().fetchSubscription();
        } catch (error) {
          console.error('Error subscribing:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      cancelSubscription: async () => {
        const { supabaseUser, isAuthenticated } = useUserStore.getState();
        if (!isAuthenticated || !supabaseUser) throw new Error('User not authenticated');

        set({ isLoading: true });
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
          });
        } catch (error) {
          console.error('Error canceling subscription:', error);
          throw error;
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