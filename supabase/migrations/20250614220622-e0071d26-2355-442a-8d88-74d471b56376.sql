
-- Create a function to delete an entire organization and all its associated data
CREATE OR REPLACE FUNCTION public.delete_organization(org_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete all user_organizations records for this organization
  DELETE FROM public.user_organizations WHERE organization_id = org_id;
  
  -- Delete the organization itself
  DELETE FROM public.organizations WHERE id = org_id;
END;
$$;

-- Create a function to delete a user and all their associated data
CREATE OR REPLACE FUNCTION public.delete_user_data(user_id_param UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete user's chat logs
  DELETE FROM public.chatlogs WHERE user_id = user_id_param;
  
  -- Delete user's organization relationship
  DELETE FROM public.user_organizations WHERE user_id = user_id_param;
  
  -- Delete user's profile
  DELETE FROM public.profiles WHERE id = user_id_param;
  
  -- Note: The auth.users record will be handled by the auth system
END;
$$;

-- Create RLS policies for the delete functions
CREATE POLICY "Only CEO can delete organization" ON public.organizations
  FOR DELETE TO authenticated
  USING (
    id IN (
      SELECT organization_id 
      FROM public.user_organizations 
      WHERE user_id = auth.uid() 
      AND executive_role = 'CEO'
    )
  );

CREATE POLICY "Users can delete their own data" ON public.profiles
  FOR DELETE TO authenticated
  USING (id = auth.uid());
