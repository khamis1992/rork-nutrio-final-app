import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  dailyGoals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  progress: {
    date: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
}

interface UserState {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  fetchNutritionProgress: () => Promise<void>;
  logNutrition: (nutrition: { calories: number; protein: number; carbs: number; fat: number }) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      supabaseUser: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          if (data.user) {
            set({ supabaseUser: data.user, isAuthenticated: true });
            await get().fetchUserProfile();
            await get().fetchNutritionProgress();
          }
        } catch (error: any) {
          throw new Error(error.message || 'Login failed');
        } finally {
          set({ isLoading: false });
        }
      },

      signup: async (email, password, name) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) throw error;

          if (data.user) {
            // Create user profile
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                name,
                email,
                daily_calories_goal: 2200,
                daily_protein_goal: 150,
                daily_carbs_goal: 220,
                daily_fat_goal: 70,
              });

            if (profileError) throw profileError;

            set({ supabaseUser: data.user, isAuthenticated: true });
            await get().fetchUserProfile();
          }
        } catch (error: any) {
          throw new Error(error.message || 'Signup failed');
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await supabase.auth.signOut();
          set({ 
            user: null, 
            supabaseUser: null, 
            isAuthenticated: false 
          });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },

      updateUser: async (userData) => {
        const { supabaseUser } = get();
        if (!supabaseUser) return;

        try {
          const updateData: any = {};
          
          if (userData.name) updateData.name = userData.name;
          if (userData.dailyGoals) {
            updateData.daily_calories_goal = userData.dailyGoals.calories;
            updateData.daily_protein_goal = userData.dailyGoals.protein;
            updateData.daily_carbs_goal = userData.dailyGoals.carbs;
            updateData.daily_fat_goal = userData.dailyGoals.fat;
          }

          const { error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', supabaseUser.id);

          if (error) throw error;

          await get().fetchUserProfile();
        } catch (error) {
          console.error('Update user error:', error);
          throw error;
        }
      },

      fetchUserProfile: async () => {
        const { supabaseUser } = get();
        if (!supabaseUser) return;

        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', supabaseUser.id)
            .single();

          if (error) throw error;

          if (data) {
            const user: User = {
              id: data.id,
              name: data.name,
              email: data.email,
              avatar: data.avatar_url || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
              dailyGoals: {
                calories: data.daily_calories_goal,
                protein: data.daily_protein_goal,
                carbs: data.daily_carbs_goal,
                fat: data.daily_fat_goal,
              },
              progress: get().user?.progress || [],
            };

            set({ user });
          }
        } catch (error) {
          console.error('Fetch user profile error:', error);
        }
      },

      fetchNutritionProgress: async () => {
        const { supabaseUser } = get();
        if (!supabaseUser) return;

        try {
          const { data, error } = await supabase
            .from('nutrition_logs')
            .select('*')
            .eq('user_id', supabaseUser.id)
            .order('date', { ascending: true })
            .limit(30);

          if (error) throw error;

          if (data) {
            const progress = data.map(log => ({
              date: log.date,
              calories: log.calories,
              protein: log.protein,
              carbs: log.carbs,
              fat: log.fat,
            }));

            set(state => ({
              user: state.user ? { ...state.user, progress } : null
            }));
          }
        } catch (error) {
          console.error('Fetch nutrition progress error:', error);
        }
      },

      logNutrition: async (nutrition) => {
        const { supabaseUser } = get();
        if (!supabaseUser) return;

        try {
          const today = new Date().toISOString().split('T')[0];

          // Check if log exists for today
          const { data: existingLog } = await supabase
            .from('nutrition_logs')
            .select('*')
            .eq('user_id', supabaseUser.id)
            .eq('date', today)
            .single();

          if (existingLog) {
            // Update existing log
            const { error } = await supabase
              .from('nutrition_logs')
              .update({
                calories: existingLog.calories + nutrition.calories,
                protein: existingLog.protein + nutrition.protein,
                carbs: existingLog.carbs + nutrition.carbs,
                fat: existingLog.fat + nutrition.fat,
              })
              .eq('id', existingLog.id);

            if (error) throw error;
          } else {
            // Create new log
            const { error } = await supabase
              .from('nutrition_logs')
              .insert({
                user_id: supabaseUser.id,
                date: today,
                calories: nutrition.calories,
                protein: nutrition.protein,
                carbs: nutrition.carbs,
                fat: nutrition.fat,
              });

            if (error) throw error;
          }

          await get().fetchNutritionProgress();
        } catch (error) {
          console.error('Log nutrition error:', error);
          throw error;
        }
      },
    }),
    {
      name: 'nutrio-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        supabaseUser: state.supabaseUser,
      }),
    }
  )
);

// Initialize auth state
supabase.auth.onAuthStateChange((event, session) => {
  const { supabaseUser, fetchUserProfile, fetchNutritionProgress } = useUserStore.getState();
  
  if (event === 'SIGNED_IN' && session?.user) {
    useUserStore.setState({ 
      supabaseUser: session.user, 
      isAuthenticated: true 
    });
    fetchUserProfile();
    fetchNutritionProgress();
  } else if (event === 'SIGNED_OUT') {
    useUserStore.setState({ 
      user: null, 
      supabaseUser: null, 
      isAuthenticated: false 
    });
  }
});