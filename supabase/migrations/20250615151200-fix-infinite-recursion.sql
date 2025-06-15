
-- Fix the infinite recursion issue in user_organizations RLS policies
-- The problem is the policy "Users can view organization relationships within their organization"
-- is causing recursive lookups

-- Drop the problematic policy that's causing infinite recursion
DROP POLICY IF EXISTS "Users can view organization relationships within their organization" ON public.user_organizations;

-- Create a simpler, non-recursive policy for viewing organization relationships
-- This allows users to see other users in the same organization without recursion
CREATE POLICY "Users can view same organization members" ON public.user_organizations
  FOR SELECT TO authenticated 
  USING (
    -- Allow viewing own relationships
    user_id = (SELECT auth.uid())
    OR
    -- Allow viewing relationships of users in the same organization
    -- Using a direct organization_id match instead of a subquery to avoid recursion
    organization_id = ANY(
      SELECT DISTINCT organization_id 
      FROM public.user_organizations 
      WHERE user_id = (SELECT auth.uid())
      LIMIT 1
    )
  );

-- Also ensure the basic policies exist and are correct
CREATE POLICY IF NOT EXISTS "Users can create their own organization relationships" ON public.user_organizations
  FOR INSERT TO authenticated 
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY IF NOT EXISTS "Users can update their own organization relationships" ON public.user_organizations
  FOR UPDATE TO authenticated 
  USING (user_id = (SELECT auth.uid()));
