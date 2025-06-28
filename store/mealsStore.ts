import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { useUserStore } from './userStore';

export interface Meal {
  id: string;
  name: string;
  description: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  restaurant: string;
  restaurantLogo: string;
  category: string[];
  ingredients: string[];
  price: number;
}

interface MealsState {
  meals: Meal[];
  plannedMeals: any[];
  selectedCategory: string;
  isLoading: boolean;
  error: string | null;
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
      error: null,

      fetchMeals: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('meals')
            .select('*')
            .eq('available', true)
            .order('created_at', { ascending: false });

          if (error) throw error;

          // Transform Supabase data to match our Meal interface
          const transformedMeals: Meal[] = (data || []).map(meal => ({
            id: meal.id,
            name: meal.name,
            description: meal.description || '',
            image: meal.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            calories: meal.calories || 0,
            protein: meal.protein || 0,
            carbs: meal.carbs || 0,
            fat: meal.fat || 0,
            restaurant: meal.restaurant_name || 'Unknown Restaurant',
            restaurantLogo: meal.restaurant_logo_url || 'https://images.unsplash.com/photo-1581349485608-9469926a8e5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
            category: meal.category || [],
            ingredients: meal.ingredients || [],
            price: Number(meal.price) || 0,
          }));

          set({ meals: transformedMeals });
          await get().fetchPlannedMeals();
        } catch (error: any) {
          console.error('Error fetching meals:', error);
          set({ error: error.message || 'Failed to fetch meals' });
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
        } catch (error: any) {
          console.error('Error adding meal to plan:', error);
          throw new Error(error.message || 'Failed to add meal to plan');
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
        } catch (error: any) {
          console.error('Error removing meal from plan:', error);
          throw new Error(error.message || 'Failed to remove meal from plan');
        }
      },

      logMealAsEaten: async (mealId) => {
        const meal = get().getMealById(mealId);
        if (!meal) throw new Error('Meal not found');

        try {
          const { logNutrition } = useUserStore.getState();
          await logNutrition({
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fat: meal.fat,
          });
        } catch (error: any) {
          console.error('Error logging meal as eaten:', error);
          throw new Error(error.message || 'Failed to log meal');
        }
      },
    }),
    {
      name: 'nutrio-meals-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedCategory: state.selectedCategory,
      }),
    }
  )
);