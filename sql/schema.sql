-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  daily_calories_goal INTEGER DEFAULT 2200,
  daily_protein_goal INTEGER DEFAULT 150,
  daily_carbs_goal INTEGER DEFAULT 220,
  daily_fat_goal INTEGER DEFAULT 70,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create nutrition_logs table
CREATE TABLE IF NOT EXISTS nutrition_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  calories INTEGER NOT NULL DEFAULT 0,
  protein INTEGER NOT NULL DEFAULT 0,
  carbs INTEGER NOT NULL DEFAULT 0,
  fat INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  gym_access BOOLEAN DEFAULT FALSE,
  meals_remaining INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meal_plans table
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  meal_id TEXT NOT NULL,
  date DATE NOT NULL,
  meal_time TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date, meal_time)
);

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  image_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0.0,
  cuisine_type TEXT,
  delivery_time TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meals table
CREATE TABLE IF NOT EXISTS meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  calories INTEGER NOT NULL DEFAULT 0,
  protein INTEGER NOT NULL DEFAULT 0,
  carbs INTEGER NOT NULL DEFAULT 0,
  fat INTEGER NOT NULL DEFAULT 0,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE SET NULL,
  restaurant_name TEXT,
  restaurant_logo_url TEXT,
  category TEXT[] DEFAULT '{}',
  ingredients TEXT[] DEFAULT '{}',
  price DECIMAL(10,2) DEFAULT 0.00,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for nutrition_logs
CREATE POLICY "Users can view own nutrition logs" ON nutrition_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nutrition logs" ON nutrition_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nutrition logs" ON nutrition_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own nutrition logs" ON nutrition_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for meal_plans
CREATE POLICY "Users can view own meal plans" ON meal_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meal plans" ON meal_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal plans" ON meal_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal plans" ON meal_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for restaurants (public read access)
CREATE POLICY "Anyone can view restaurants" ON restaurants
  FOR SELECT USING (true);

-- Create policies for meals (public read access)
CREATE POLICY "Anyone can view available meals" ON meals
  FOR SELECT USING (available = true);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER meals_updated_at
  BEFORE UPDATE ON meals
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Insert sample restaurants
INSERT INTO restaurants (name, logo_url, image_url, rating, cuisine_type, delivery_time) VALUES
('Clean Eats', 'https://images.unsplash.com/photo-1581349485608-9469926a8e5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 4.8, 'Healthy Seafood', '25-35 min'),
('Green Garden', 'https://images.unsplash.com/photo-1518057111178-44a106bad636?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 4.9, 'Vegan & Vegetarian', '20-30 min'),
('Muscle Kitchen', 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 4.7, 'High Protein', '30-40 min'),
('Keto Corner', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', 'https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 4.6, 'Keto & Low-Carb', '35-45 min'),
('Mediterranean Delights', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 4.9, 'Mediterranean', '20-30 min'),
('Smoothie Station', 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', 'https://images.unsplash.com/photo-1577805947697-89e18249d767?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 4.5, 'Smoothies & Bowls', '15-25 min')
ON CONFLICT DO NOTHING;

-- Insert sample meals
INSERT INTO meals (name, description, image_url, calories, protein, carbs, fat, restaurant_name, restaurant_logo_url, category, ingredients, price) VALUES
('Grilled Salmon Bowl', 'Fresh grilled salmon with quinoa, avocado, and mixed greens', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 450, 32, 38, 18, 'Clean Eats', 'https://images.unsplash.com/photo-1581349485608-9469926a8e5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', '{"Protein", "Low-carb", "Pescatarian"}', '{"Wild salmon", "Quinoa", "Avocado", "Mixed greens", "Lemon", "Olive oil", "Sea salt"}', 14.99),
('Vegan Buddha Bowl', 'Nutrient-rich bowl with roasted vegetables, chickpeas, and tahini dressing', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 380, 15, 52, 12, 'Green Garden', 'https://images.unsplash.com/photo-1518057111178-44a106bad636?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', '{"Vegan", "Plant-based", "Gluten-free"}', '{"Sweet potato", "Chickpeas", "Kale", "Quinoa", "Avocado", "Tahini", "Lemon juice"}', 12.99),
('Protein Power Plate', 'Grilled chicken breast with sweet potato and steamed broccoli', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 520, 42, 45, 10, 'Muscle Kitchen', 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', '{"Protein", "Muscle", "Low-fat"}', '{"Chicken breast", "Sweet potato", "Broccoli", "Olive oil", "Herbs", "Spices"}', 15.99),
('Keto Avocado Salad', 'Low-carb salad with avocado, eggs, bacon, and mixed greens', 'https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 480, 22, 8, 42, 'Keto Corner', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', '{"Keto", "Low-carb", "High-fat"}', '{"Avocado", "Eggs", "Bacon", "Mixed greens", "Cherry tomatoes", "Olive oil", "Lemon juice"}', 13.99),
('Mediterranean Wrap', 'Whole grain wrap with hummus, falafel, and fresh vegetables', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 410, 18, 58, 14, 'Mediterranean Delights', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', '{"Vegetarian", "Mediterranean", "Balanced"}', '{"Whole grain wrap", "Hummus", "Falafel", "Cucumber", "Tomato", "Red onion", "Tahini sauce"}', 11.99),
('Berry Protein Smoothie Bowl', 'Protein-packed smoothie bowl with mixed berries and granola', 'https://images.unsplash.com/photo-1577805947697-89e18249d767?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 350, 24, 42, 8, 'Smoothie Station', 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', '{"Breakfast", "Protein", "Vegetarian"}', '{"Protein powder", "Mixed berries", "Banana", "Almond milk", "Granola", "Chia seeds", "Honey"}', 9.99),
('Quinoa Power Bowl', 'Superfood bowl with quinoa, kale, and roasted vegetables', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 420, 16, 65, 14, 'Green Garden', 'https://images.unsplash.com/photo-1518057111178-44a106bad636?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', '{"Vegan", "Gluten-free", "Balanced"}', '{"Quinoa", "Kale", "Roasted vegetables", "Pumpkin seeds", "Lemon dressing"}', 13.99),
('Lean Beef Stir Fry', 'High-protein stir fry with lean beef and vegetables', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 480, 38, 35, 18, 'Muscle Kitchen', 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', '{"Protein", "Muscle", "Low-carb"}', '{"Lean beef", "Bell peppers", "Broccoli", "Snap peas", "Ginger", "Garlic"}', 16.99)
ON CONFLICT DO NOTHING;