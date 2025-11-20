-- Expense Tracker Enhanced Schema
-- Run this in your Supabase SQL Editor

-- 1. Create storage bucket for receipts and avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true),
       ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create user profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Add receipt_url column to expenses table
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS receipt_url TEXT;

-- 4. Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  period TEXT NOT NULL DEFAULT 'monthly',
  alert_threshold DECIMAL(3, 2) DEFAULT 0.80,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category, period)
);

-- 5. Create spending insights cache table (optional - for performance)
CREATE TABLE IF NOT EXISTS spending_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  month DATE NOT NULL,
  total_spent DECIMAL(10, 2),
  top_category TEXT,
  insights_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month)
);

-- 6. Row Level Security Policies

-- Profiles RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Budgets RLS
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own budgets"
  ON budgets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budgets"
  ON budgets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets"
  ON budgets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets"
  ON budgets FOR DELETE
  USING (auth.uid() = user_id);

-- Spending insights RLS
ALTER TABLE spending_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own insights"
  ON spending_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own insights"
  ON spending_insights FOR ALL
  USING (auth.uid() = user_id);

-- 7. Storage policies for receipts bucket
CREATE POLICY "Users can upload receipts"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'receipts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own receipts"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'receipts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own receipts"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'receipts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 8. Storage policies for avatars bucket
CREATE POLICY "Users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 9. Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile automatically
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply to budgets table
CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
