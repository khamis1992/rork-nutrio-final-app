export interface Gym {
  id: string;
  name: string;
  image: string;
  logo: string;
  address: string;
  distance: string;
  rating: number;
  amenities: string[];
}

export const gyms: Gym[] = [
  {
    id: '1',
    name: 'FitZone',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    address: '123 Fitness Ave, New York, NY',
    distance: '1.2 miles',
    rating: 4.8,
    amenities: ['24/7 Access', 'Personal Training', 'Group Classes', 'Sauna'],
  },
  {
    id: '2',
    name: 'PowerHouse Gym',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    address: '456 Strength St, New York, NY',
    distance: '0.8 miles',
    rating: 4.6,
    amenities: ['Free Weights', 'Cardio Equipment', 'Protein Bar', 'Showers'],
  },
  {
    id: '3',
    name: 'Yoga Haven',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    address: '789 Zen Blvd, New York, NY',
    distance: '1.5 miles',
    rating: 4.9,
    amenities: ['Yoga Classes', 'Meditation', 'Wellness Workshops', 'Tea Bar'],
  },
  {
    id: '4',
    name: 'CrossFit Box',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1533681904393-9ab6eee7e408?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    address: '101 Intensity Rd, New York, NY',
    distance: '2.1 miles',
    rating: 4.7,
    amenities: ['CrossFit Classes', 'Open Gym', 'Olympic Lifting', 'Mobility'],
  },
  {
    id: '5',
    name: 'Cardio Club',
    image: 'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    address: "202 Runner Way, New York, NY",
    distance: '0.5 miles',
    rating: 4.5,
    amenities: ['Treadmills', 'Ellipticals', 'Rowing Machines', 'Cycling Studio'],
  },
];