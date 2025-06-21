import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { plans, Plan, mockSubscription, SubscriptionStatus } from '@/mocks/plans';

interface SubscriptionState {
  plans: Plan[];
  subscription: SubscriptionStatus;
  isLoading: boolean;
  fetchPlans: () => Promise<void>;
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
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // For demo purposes, we'll use mock data
          set({ plans, subscription: mockSubscription });
        } catch (error) {
          console.error('Error fetching plans:', error);
        } finally {
          set({ isLoading: false });
        }
      },
      subscribe: async (planId, withGymAccess) => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
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
          
          set({
            subscription: {
              active: true,
              plan: selectedPlan,
              startDate: startDate.toISOString().split('T')[0],
              endDate: endDate.toISOString().split('T')[0],
              gymAccess: withGymAccess,
              mealsRemaining: selectedPlan.duration === 'daily' ? 3 : 
                              selectedPlan.duration === 'weekly' ? 21 : 90,
            },
          });
        } catch (error) {
          console.error('Error subscribing:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      cancelSubscription: async () => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
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
    }
  )
);