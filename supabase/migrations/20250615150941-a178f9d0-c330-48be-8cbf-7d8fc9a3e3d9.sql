
-- Allow users to view other users' organization relationships within the same organization
CREATE POLICY "Users can view organization relationships within their organization" ON public.user_organizations
  FOR SELECT TO authenticated 
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM public.user_organizations 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- Drop the old restrictive policy that only allows viewing own relationships
DROP POLICY IF EXISTS "Users can view their own organization relationships" ON public.user_organizations;
