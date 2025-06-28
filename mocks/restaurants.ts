export interface Restaurant {
  id: string;
  name: string;
  image: string;
  logo: string;
  rating: number;
  cuisineType: string;
  deliveryTime: string;
  tags: {
    text: string;
    color: 'red' | 'blue' | 'yellow' | 'green';
  }[];
  isFavorite?: boolean;
}

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Green Garden',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1518057111178-44a106bad636?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    rating: 4.8,
    cuisineType: 'Healthy Bowls',
    deliveryTime: '25-35 min',
    tags: [
      { text: 'Support Local', color: 'green' },
      { text: 'Free Delivery', color: 'blue' }
    ],
    isFavorite: true,
  },
  {
    id: '2',
    name: 'Muscle Kitchen',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    rating: 4.7,
    cuisineType: 'Protein Meals',
    deliveryTime: '30-40 min',
    tags: [
      { text: '30% Off', color: 'red' },
      { text: 'High Protein', color: 'yellow' }
    ],
    isFavorite: false,
  },
  {
    id: '3',
    name: 'Mediterranean Delights',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    rating: 4.9,
    cuisineType: 'Mediterranean',
    deliveryTime: '20-30 min',
    tags: [
      { text: 'Support Local', color: 'green' },
      { text: 'Vegetarian', color: 'yellow' }
    ],
    isFavorite: true,
  },
  {
    id: '4',
    name: 'Keto Corner',
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    rating: 4.6,
    cuisineType: 'Keto & Low-Carb',
    deliveryTime: '35-45 min',
    tags: [
      { text: 'Free Delivery', color: 'blue' },
      { text: 'Keto Friendly', color: 'yellow' }
    ],
    isFavorite: false,
  },
  {
    id: '5',
    name: 'Smoothie Station',
    image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    rating: 4.5,
    cuisineType: 'Smoothies & Bowls',
    deliveryTime: '15-25 min',
    tags: [
      { text: '20% Off', color: 'red' },
      { text: 'Quick Delivery', color: 'blue' }
    ],
    isFavorite: true,
  },
  {
    id: '6',
    name: 'Clean Eats',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1581349485608-9469926a8e5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    rating: 4.8,
    cuisineType: 'Fresh Seafood',
    deliveryTime: '40-50 min',
    tags: [
      { text: 'Support Local', color: 'green' },
      { text: 'Fresh Daily', color: 'yellow' }
    ],
    isFavorite: false,
  },
];