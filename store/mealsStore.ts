import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { meals, Meal, categories } from '@/mocks/meals';
import { mockPlannedMeals } from '@/mocks/user';

interface MealsState {
  meals: Meal[];
  plannedMeals: any[];
  selectedCategory: string;
  isLoading: boolean;
  fetchMeals: () => Promise<void>;
  setSelectedCategory: (category: string) => void;
  getMealById: (id: string) => Meal | undefined;
  addMealToPlan: (mealId: string, date: string, mealTime: string) => void;
  removeMealFromPlan: (date: string, mealTime: string) => void;
  logMealAsEaten: (mealId: string) => void;
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
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // For demo purposes, we'll use mock data
          set({ meals, plannedMeals: mockPlannedMeals });
        } catch (error) {
          console.error('Error fetching meals:', error);
        } finally {
          set({ isLoading: false });
        }
      },
      setSelectedCategory: (category) => {
        set({ selectedCategory: category });
      },
      getMealById: (id) => {
        return get().meals.find((meal) => meal.id === id);
      },
      addMealToPlan: (mealId, date, mealTime) => {
        set((state) => {
          const existingDateIndex = state.plannedMeals.findIndex(
            (item) => item.date === date
          );
          
          if (existingDateIndex >= 0) {
            // Date exists, update or add meal
            const updatedPlannedMeals = [...state.plannedMeals];
            const existingMealIndex = updatedPlannedMeals[existingDateIndex].meals.findIndex(
              (meal: any) => meal.mealTime === mealTime
            );
            
            if (existingMealIndex >= 0) {
              // Update existing meal
              updatedPlannedMeals[existingDateIndex].meals[existingMealIndex] = {
                id: mealId,
                mealTime,
              };
            } else {
              // Add new meal
              updatedPlannedMeals[existingDateIndex].meals.push({
                id: mealId,
                mealTime,
              });
            }
            
            return { plannedMeals: updatedPlannedMeals };
          } else {
            // Add new date with meal
            return {
              plannedMeals: [
                ...state.plannedMeals,
                {
                  date,
                  meals: [{ id: mealId, mealTime }],
                },
              ],
            };
          }
        });
      },
      removeMealFromPlan: (date, mealTime) => {
        set((state) => {
          const existingDateIndex = state.plannedMeals.findIndex(
            (item) => item.date === date
          );
          
          if (existingDateIndex >= 0) {
            const updatedPlannedMeals = [...state.plannedMeals];
            updatedPlannedMeals[existingDateIndex].meals = updatedPlannedMeals[
              existingDateIndex
            ].meals.filter((meal: any) => meal.mealTime !== mealTime);
            
            // If no meals left for this date, remove the date entry
            if (updatedPlannedMeals[existingDateIndex].meals.length === 0) {
              updatedPlannedMeals.splice(existingDateIndex, 1);
            }
            
            return { plannedMeals: updatedPlannedMeals };
          }
          
          return state;
        });
      },
      logMealAsEaten: (mealId) => {
        // In a real app, this would update nutrition tracking
        console.log(`Meal ${mealId} logged as eaten`);
      },
    }),
    {
      name: 'nutrio-meals-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);