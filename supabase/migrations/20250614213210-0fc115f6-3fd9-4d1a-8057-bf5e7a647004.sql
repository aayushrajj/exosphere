
-- Drop the existing problematic policy for creating organizations
DROP POLICY IF EXISTS "Users can create organizations" ON public.organizations;

-- Create a new policy that allows any authenticated user to create organizations
CREATE POLICY "Authenticated users can create organizations" ON public.organizations
  FOR INSERT TO authenticated 
  WITH CHECK (true);

-- Also update the SELECT policy to allow users to see organizations by org_code
-- This is needed for the organization validation during join flow
DROP POLICY IF EXISTS "Users can view organizations they belong to" ON public.organizations;

CREATE POLICY "Users can view organizations they belong to or by org_code" ON public.organizations
  FOR SELECT TO authenticated 
  USING (
    id IN (
      SELECT organization_id FROM public.user_organizations 
      WHERE user_id = (SELECT auth.uid())
    )
    OR true  -- Allow reading for org_code validation
  );
