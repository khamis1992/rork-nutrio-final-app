import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface Restaurant {
  id: string;
  name: string;
  logo_url: string | null;
  image_url: string | null;
  rating: number;
  cuisine_type: string | null;
  delivery_time: string | null;
  isFavorite?: boolean;
}

interface RestaurantsState {
  restaurants: Restaurant[];
  isLoading: boolean;
  error: string | null;
  favoriteRestaurants: Set<string>;
  fetchRestaurants: () => Promise<void>;
  toggleFavorite: (id: string) => void;
  getRestaurantById: (id: string) => Restaurant | undefined;
}

export const useRestaurantsStore = create<RestaurantsState>((set, get) => ({
  restaurants: [],
  isLoading: false,
  error: null,
  favoriteRestaurants: new Set(),

  fetchRestaurants: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;

      const { favoriteRestaurants } = get();
      const restaurantsWithFavorites = (data || []).map(restaurant => ({
        ...restaurant,
        isFavorite: favoriteRestaurants.has(restaurant.id),
      }));

      set({ restaurants: restaurantsWithFavorites, error: null });
    } catch (error: any) {
      console.error('Error fetching restaurants:', error);
      set({ error: error.message || 'Failed to fetch restaurants' });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleFavorite: (id: string) => {
    set((state) => {
      const newFavorites = new Set(state.favoriteRestaurants);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }

      const updatedRestaurants = state.restaurants.map(restaurant =>
        restaurant.id === id
          ? { ...restaurant, isFavorite: newFavorites.has(id) }
          : restaurant
      );

      return {
        favoriteRestaurants: newFavorites,
        restaurants: updatedRestaurants,
      };
    });
  },

  getRestaurantById: (id: string) => {
    return get().restaurants.find(restaurant => restaurant.id === id);
  },
}));