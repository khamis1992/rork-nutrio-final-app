import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface Gym {
  id: string;
  name: string;
  image_url: string;
  logo_url: string;
  address: string;
  distance: string;
  rating: number;
  amenities: string[];
}

interface GymsState {
  gyms: Gym[];
  isLoading: boolean;
  error: string | null;
  fetchGyms: () => Promise<void>;
}

export const useGymsStore = create<GymsState>((set) => ({
  gyms: [],
  isLoading: false,
  error: null,

  fetchGyms: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('gyms')
        .select('*')
        .order('name');

      if (error) throw error;

      set({ gyms: data || [], error: null });
    } catch (error: any) {
      console.error('Error fetching gyms:', error);
      set({ error: error.message || 'Failed to fetch gyms' });
      
      // Fallback to mock data if Supabase fails
      const { gyms: mockGyms } = await import('@/mocks/gyms');
      const mappedGyms = mockGyms.map(gym => ({
        id: gym.id,
        name: gym.name,
        image_url: gym.image,
        logo_url: gym.logo,
        address: gym.address,
        distance: gym.distance,
        rating: gym.rating,
        amenities: gym.amenities,
      }));
      set({ gyms: mappedGyms });
    } finally {
      set({ isLoading: false });
    }
  },
}));