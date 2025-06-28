-- Create gyms table
CREATE TABLE IF NOT EXISTS gyms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  address TEXT NOT NULL,
  distance TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 4.5,
  amenities TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample gym data
INSERT INTO gyms (name, image_url, logo_url, address, distance, rating, amenities) VALUES
(
  'FitZone',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  '123 Fitness Ave, New York, NY',
  '1.2 miles',
  4.8,
  ARRAY['24/7 Access', 'Personal Training', 'Group Classes', 'Sauna']
),
(
  'PowerHouse Gym',
  'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  '456 Strength St, New York, NY',
  '0.8 miles',
  4.6,
  ARRAY['Free Weights', 'Cardio Equipment', 'Protein Bar', 'Showers']
),
(
  'Yoga Haven',
  'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  '789 Zen Blvd, New York, NY',
  '1.5 miles',
  4.9,
  ARRAY['Yoga Classes', 'Meditation', 'Wellness Workshops', 'Tea Bar']
),
(
  'CrossFit Box',
  'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1533681904393-9ab6eee7e408?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  '101 Intensity Rd, New York, NY',
  '2.1 miles',
  4.7,
  ARRAY['CrossFit Classes', 'Open Gym', 'Olympic Lifting', 'Mobility']
),
(
  'Cardio Club',
  'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  '202 Runner Way, New York, NY',
  '0.5 miles',
  4.5,
  ARRAY['Treadmills', 'Ellipticals', 'Rowing Machines', 'Cycling Studio']
);

-- Enable Row Level Security
ALTER TABLE gyms ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to read gyms
CREATE POLICY "Allow all users to read gyms" ON gyms
  FOR SELECT USING (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_gyms_updated_at BEFORE UPDATE ON gyms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();