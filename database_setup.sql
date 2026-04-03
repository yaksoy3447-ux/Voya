-- ==============================================================================
-- VOYA DATABASE SETUP (RUN THIS IN SUPABASE SQL EDITOR)
-- ==============================================================================

-- 1. Create PROFILES table to track Free vs Pro users
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  tier text default 'Free', -- Can be 'Free', 'Explorer', 'Nomad'
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_end_date timestamp with time zone,
  plan_count integer default 0, -- Free users get exactly 3 plans
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create PLANS table to store generated itineraries
CREATE TABLE IF NOT EXISTS public.plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  destination text not null,
  budget text,
  itinerary jsonb not null, -- The entire Claude AI JSON output
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Setup Row Level Security (RLS) policies 
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- 4. Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 5. Policies for plans
CREATE POLICY "Users can view own plans." ON public.plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own plans." ON public.plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own plans." ON public.plans FOR DELETE USING (auth.uid() = user_id);

-- 6. Trigger to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, tier, plan_count)
  VALUES (new.id, new.email, 'Free', 0);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it already exists to prevent errors
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. Function to safely increment plan_count
CREATE OR REPLACE FUNCTION public.increment_plan_count(row_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET plan_count = plan_count + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- MIGRATION: Run these if you already have the tables set up
-- ==============================================================================

-- Add subscription_end_date column if missing
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_end_date timestamp with time zone;

-- Add is_public column for shareable plan links (Nomad tier)
ALTER TABLE public.plans
  ADD COLUMN IF NOT EXISTS is_public boolean default false;

-- Allow public (unauthenticated) read access to public plans
CREATE POLICY IF NOT EXISTS "Public plans are viewable by anyone."
  ON public.plans FOR SELECT
  USING (is_public = true);

-- ==============================================================================
-- DONE! Check your Database -> Tables to see 'profiles' and 'plans'
-- ==============================================================================
