import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { meals, Meal, categories } from '@/mocks/meals';
import { supabase } from '@/lib/supabase';
import { useUserStore } from './userStore';

interface MealsState {
  meals: Meal[];
  plannedMeals: any[];
  selectedCategory: string;
  isLoading: boolean;
  fetchMeals: () => Promise<void>;
  fetchPlannedMeals: () => Promise<void>;
  setSelectedCategory: (category: string) => void;
  getMealById: (id: string) => Meal | undefined;
  addMealToPlan: (mealId: string, date: string, mealTime: string) => Promise<void>;
  removeMealFromPlan: (date: string, mealTime: string) => Promise<void>;
  logMealAsEaten: (mealId: string) => Promise<void>;
}

export const useMealsStore = create<MealsState>()(
  persist(
    (set, get) => ({
      meals: [],
      plannedMeals: [],
      selectedCategory: 'all',
      isLoading: false,

      fetchMeals: async () => {
        set({ isLoading: true });
        try {
          // For now, use mock data for meals
          // In a real app, you'd fetch from Supabase
          set({ meals });
          await get().fetchPlannedMeals();
        } catch (error) {
          console.error('Error fetching meals:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      fetchPlannedMeals: async () => {
        const { supabaseUser } = useUserStore.getState();
        if (!supabaseUser) return;

        try {
          const { data, error } = await supabase
            .from('meal_plans')
            .select('*')
            .eq('user_id', supabaseUser.id)
            .order('date', { ascending: true });

          if (error) throw error;

          // Group by date
          const groupedMeals: any[] = [];
          const dateGroups: { [key: string]: any[] } = {};

          data?.forEach(plan => {
            if (!dateGroups[plan.date]) {
              dateGroups[plan.date] = [];
            }
            dateGroups[plan.date].push({
              id: plan.meal_id,
              mealTime: plan.meal_time,
            });
          });

          Object.keys(dateGroups).forEach(date => {
            groupedMeals.push({
              date,
              meals: dateGroups[date],
            });
          });

          set({ plannedMeals: groupedMeals });
        } catch (error) {
          console.error('Error fetching planned meals:', error);
        }
      },

      setSelectedCategory: (category) => {
        set({ selectedCategory: category });
      },

      getMealById: (id) => {
        return get().meals.find((meal) => meal.id === id);
      },

      addMealToPlan: async (mealId, date, mealTime) => {
        const { supabaseUser } = useUserStore.getState();
        if (!supabaseUser) throw new Error('User not authenticated');

        try {
          // Remove existing meal for this date and time
          await supabase
            .from('meal_plans')
            .delete()
            .eq('user_id', supabaseUser.id)
            .eq('date', date)
            .eq('meal_time', mealTime);

          // Add new meal plan
          const { error } = await supabase
            .from('meal_plans')
            .insert({
              user_id: supabaseUser.id,
              meal_id: mealId,
              date,
              meal_time: mealTime,
            });

          if (error) throw error;

          await get().fetchPlannedMeals();
        } catch (error) {
          console.error('Error adding meal to plan:', error);
          throw error;
        }
      },

      removeMealFromPlan: async (date, mealTime) => {
        const { supabaseUser } = useUserStore.getState();
        if (!supabaseUser) throw new Error('User not authenticated');

        try {
          const { error } = await supabase
            .from('meal_plans')
            .delete()
            .eq('user_id', supabaseUser.id)
            .eq('date', date)
            .eq('meal_time', mealTime);

          if (error) throw error;

          await get().fetchPlannedMeals();
        } catch (error) {
          console.error('Error removing meal from plan:', error);
          throw error;
        }
      },

      logMealAsEaten: async (mealId) => {
        const meal = get().getMealById(mealId);
        if (!meal) return;

        try {
          const { logNutrition } = useUserStore.getState();
          await logNutrition({
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fat: meal.fat,
          });
        } catch (error) {
          console.error('Error logging meal as eaten:', error);
          throw error;
        }
      },
    }),
    {
      name: 'nutrio-meals-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedCategory: state.selectedCategory,
        meals: state.meals,
      }),
    }
  )
);