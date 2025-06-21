export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: 'daily' | 'weekly' | 'monthly';
  features: string[];
  popular: boolean;
}

export const plans: Plan[] = [
  {
    id: 'daily',
    name: 'Daily Plan',
    description: 'Perfect for trying out our service',
    price: 14.99,
    duration: 'daily',
    features: [
      '3 meals per day',
      'Basic nutrition tracking',
      'No commitment',
    ],
    popular: false,
  },
  {
    id: 'weekly',
    name: 'Weekly Plan',
    description: 'Our most popular option',
    price: 89.99,
    duration: 'weekly',
    features: [
      '3 meals per day',
      'Full nutrition tracking',
      'Meal customization',
      'Basic gym access',
    ],
    popular: true,
  },
  {
    id: 'monthly',
    name: 'Monthly Plan',
    description: 'Best value for committed users',
    price: 299.99,
    duration: 'monthly',
    features: [
      '3 meals per day',
      'Full nutrition tracking',
      'Meal customization',
      'Premium gym access',
      'Personal nutrition consultation',
      'Weekly progress reports',
    ],
    popular: false,
  },
];

export interface SubscriptionStatus {
  active: boolean;
  plan: Plan | null;
  startDate: string | null;
  endDate: string | null;
  gymAccess: boolean;
  mealsRemaining: number;
}

export const mockSubscription: SubscriptionStatus = {
  active: true,
  plan: plans[1], // Weekly plan
  startDate: '2025-06-18',
  endDate: '2025-06-25',
  gymAccess: true,
  mealsRemaining: 15,
};