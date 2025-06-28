import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = 'https://loepcagitrijlfksawfm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvZXBjYWdpdHJpamxma3Nhd2ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MDU1NTgsImV4cCI6MjA2NTA4MTU1OH0.jFMchnyd3pSUmJRusi_3dNqOG_lR3sphsv3Knnefvpk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Disable auto refresh on web to prevent issues
    autoRefreshToken: Platform.OS !== 'web',
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          avatar_url: string | null;
          daily_calories_goal: number;
          daily_protein_goal: number;
          daily_carbs_goal: number;
          daily_fat_goal: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          avatar_url?: string | null;
          daily_calories_goal?: number;
          daily_protein_goal?: number;
          daily_carbs_goal?: number;
          daily_fat_goal?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          avatar_url?: string | null;
          daily_calories_goal?: number;
          daily_protein_goal?: number;
          daily_carbs_goal?: number;
          daily_fat_goal?: number;
          updated_at?: string;
        };
      };
      nutrition_logs: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          calories: number;
          protein: number;
          carbs: number;
          fat: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          calories: number;
          protein: number;
          carbs: number;
          fat: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          calories?: number;
          protein?: number;
          carbs?: number;
          fat?: number;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          plan_name: string;
          start_date: string;
          end_date: string;
          gym_access: boolean;
          meals_remaining: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id: string;
          plan_name: string;
          start_date: string;
          end_date: string;
          gym_access?: boolean;
          meals_remaining?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_id?: string;
          plan_name?: string;
          start_date?: string;
          end_date?: string;
          gym_access?: boolean;
          meals_remaining?: number;
          active?: boolean;
          updated_at?: string;
        };
      };
      meal_plans: {
        Row: {
          id: string;
          user_id: string;
          meal_id: string;
          date: string;
          meal_time: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          meal_id: string;
          date: string;
          meal_time: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          meal_id?: string;
          date?: string;
          meal_time?: string;
        };
      };
    };
  };
}