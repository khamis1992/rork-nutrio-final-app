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

export const categories = [
  { id: 'all', name: 'All' },
  { id: 'protein', name: 'Protein' },
  { id: 'vegan', name: 'Vegan' },
  { id: 'low-carb', name: 'Low-carb' },
  { id: 'keto', name: 'Keto' },
  { id: 'muscle', name: 'Muscle' },
  { id: 'vegetarian', name: 'Vegetarian' },
  { id: 'gluten-free', name: 'Gluten-free' },
  { id: 'breakfast', name: 'Breakfast' },
  { id: 'pescatarian', name: 'Pescatarian' },
  { id: 'plant-based', name: 'Plant-based' },
  { id: 'mediterranean', name: 'Mediterranean' },
  { id: 'balanced', name: 'Balanced' },
  { id: 'high-fat', name: 'High-fat' },
  { id: 'low-fat', name: 'Low-fat' },
];

export const restaurants = [
  {
    id: '1',
    name: 'Clean Eats',
    logo: 'https://images.unsplash.com/photo-1581349485608-9469926a8e5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '2',
    name: 'Green Garden',
    logo: 'https://images.unsplash.com/photo-1518057111178-44a106bad636?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '3',
    name: 'Muscle Kitchen',
    logo: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '4',
    name: 'Keto Corner',
    logo: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '5',
    name: 'Mediterranean Delights',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  },
];