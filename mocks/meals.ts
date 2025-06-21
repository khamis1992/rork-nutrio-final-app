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

export const meals: Meal[] = [
  {
    id: '1',
    name: 'Grilled Salmon Bowl',
    description: 'Fresh grilled salmon with quinoa, avocado, and mixed greens',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    calories: 450,
    protein: 32,
    carbs: 38,
    fat: 18,
    restaurant: 'Clean Eats',
    restaurantLogo: 'https://images.unsplash.com/photo-1581349485608-9469926a8e5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    category: ['Protein', 'Low-carb', 'Pescatarian'],
    ingredients: ['Wild salmon', 'Quinoa', 'Avocado', 'Mixed greens', 'Lemon', 'Olive oil', 'Sea salt'],
    price: 14.99,
  },
  {
    id: '2',
    name: 'Vegan Buddha Bowl',
    description: 'Nutrient-rich bowl with roasted vegetables, chickpeas, and tahini dressing',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    calories: 380,
    protein: 15,
    carbs: 52,
    fat: 12,
    restaurant: 'Green Garden',
    restaurantLogo: 'https://images.unsplash.com/photo-1518057111178-44a106bad636?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    category: ['Vegan', 'Plant-based', 'Gluten-free'],
    ingredients: ['Sweet potato', 'Chickpeas', 'Kale', 'Quinoa', 'Avocado', 'Tahini', 'Lemon juice'],
    price: 12.99,
  },
  {
    id: '3',
    name: 'Protein Power Plate',
    description: 'Grilled chicken breast with sweet potato and steamed broccoli',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    calories: 520,
    protein: 42,
    carbs: 45,
    fat: 10,
    restaurant: 'Muscle Kitchen',
    restaurantLogo: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    category: ['Protein', 'Muscle', 'Low-fat'],
    ingredients: ['Chicken breast', 'Sweet potato', 'Broccoli', 'Olive oil', 'Herbs', 'Spices'],
    price: 15.99,
  },
  {
    id: '4',
    name: 'Keto Avocado Salad',
    description: 'Low-carb salad with avocado, eggs, bacon, and mixed greens',
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    calories: 480,
    protein: 22,
    carbs: 8,
    fat: 42,
    restaurant: 'Keto Corner',
    restaurantLogo: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    category: ['Keto', 'Low-carb', 'High-fat'],
    ingredients: ['Avocado', 'Eggs', 'Bacon', 'Mixed greens', 'Cherry tomatoes', 'Olive oil', 'Lemon juice'],
    price: 13.99,
  },
  {
    id: '5',
    name: 'Mediterranean Wrap',
    description: 'Whole grain wrap with hummus, falafel, and fresh vegetables',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    calories: 410,
    protein: 18,
    carbs: 58,
    fat: 14,
    restaurant: 'Mediterranean Delights',
    restaurantLogo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    category: ['Vegetarian', 'Mediterranean', 'Balanced'],
    ingredients: ['Whole grain wrap', 'Hummus', 'Falafel', 'Cucumber', 'Tomato', 'Red onion', 'Tahini sauce'],
    price: 11.99,
  },
  {
    id: '6',
    name: 'Berry Protein Smoothie Bowl',
    description: 'Protein-packed smoothie bowl with mixed berries and granola',
    image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    calories: 350,
    protein: 24,
    carbs: 42,
    fat: 8,
    restaurant: 'Smoothie Station',
    restaurantLogo: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    category: ['Breakfast', 'Protein', 'Vegetarian'],
    ingredients: ['Protein powder', 'Mixed berries', 'Banana', 'Almond milk', 'Granola', 'Chia seeds', 'Honey'],
    price: 9.99,
  },
];

export const categories = [
  { id: 'all', name: 'All' },
  { id: 'protein', name: 'Protein' },
  { id: 'vegan', name: 'Vegan' },
  { id: 'low-carb', name: 'Low-carb' },
  { id: 'keto', name: 'Keto' },
  { id: 'muscle', name: 'Muscle' },
  { id: 'vegetarian', name: 'Vegetarian' },
  { id: 'gluten-free', name: 'Gluten-free' },
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