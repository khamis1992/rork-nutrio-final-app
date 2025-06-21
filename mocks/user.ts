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

export const mockUser: User = {
  id: '1',
  name: 'Bader',
  email: 'bader@example.com',
  avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  dailyGoals: {
    calories: 2200,
    protein: 150,
    carbs: 220,
    fat: 70,
  },
  progress: [
    {
      date: '2025-06-15',
      calories: 2100,
      protein: 145,
      carbs: 210,
      fat: 65,
    },
    {
      date: '2025-06-16',
      calories: 2050,
      protein: 140,
      carbs: 200,
      fat: 68,
    },
    {
      date: '2025-06-17',
      calories: 2150,
      protein: 148,
      carbs: 215,
      fat: 67,
    },
    {
      date: '2025-06-18',
      calories: 2180,
      protein: 152,
      carbs: 218,
      fat: 69,
    },
    {
      date: '2025-06-19',
      calories: 2120,
      protein: 147,
      carbs: 212,
      fat: 66,
    },
    {
      date: '2025-06-20',
      calories: 2200,
      protein: 150,
      carbs: 220,
      fat: 70,
    },
    {
      date: '2025-06-21',
      calories: 1800,
      protein: 130,
      carbs: 180,
      fat: 60,
    },
  ],
};

export const mockPlannedMeals = [
  {
    date: '2025-06-21',
    meals: [
      { id: '1', mealTime: 'Breakfast' },
      { id: '3', mealTime: 'Lunch' },
      { id: '2', mealTime: 'Dinner' },
    ],
  },
  {
    date: '2025-06-22',
    meals: [
      { id: '6', mealTime: 'Breakfast' },
      { id: '4', mealTime: 'Lunch' },
      { id: '5', mealTime: 'Dinner' },
    ],
  },
  {
    date: '2025-06-23',
    meals: [
      { id: '6', mealTime: 'Breakfast' },
      { id: '1', mealTime: 'Lunch' },
      { id: '3', mealTime: 'Dinner' },
    ],
  },
];