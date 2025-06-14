
-- Create organizations table
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  founding_year INTEGER,
  domain TEXT,
  description TEXT NOT NULL,
  org_code TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(6), 'base64'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_organizations table to link users with organizations
CREATE TABLE public.user_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  executive_role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id), -- One organization per user
  UNIQUE(organization_id, executive_role) -- Unique executive role per organization
);

-- Create profiles table to store user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for organizations
CREATE POLICY "Users can view organizations they belong to" ON public.organizations
  FOR SELECT TO authenticated 
  USING (id IN (
    SELECT organization_id FROM public.user_organizations 
    WHERE user_id = (SELECT auth.uid())
  ));

CREATE POLICY "Users can create organizations" ON public.organizations
  FOR INSERT TO authenticated WITH CHECK (true);

-- RLS policies for user_organizations
CREATE POLICY "Users can view their own organization relationships" ON public.user_organizations
  FOR SELECT TO authenticated 
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can create their own organization relationships" ON public.user_organizations
  FOR INSERT TO authenticated 
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own organization relationships" ON public.user_organizations
  FOR UPDATE TO authenticated 
  USING ((SELECT auth.uid()) = user_id);

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated 
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can create their own profile" ON public.profiles
  FOR INSERT TO authenticated 
  WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated 
  USING ((SELECT auth.uid()) = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, onboarding_completed)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', FALSE);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
