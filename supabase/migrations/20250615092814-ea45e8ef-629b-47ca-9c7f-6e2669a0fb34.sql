
-- Add database constraints for business rules
ALTER TABLE public.organizations 
ADD CONSTRAINT organizations_name_not_empty CHECK (trim(name) != '');

-- Add constraint for organization member limit (20 members max)
-- We'll enforce this in application logic since it's dynamic

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_organizations_name ON public.organizations(name);
CREATE INDEX IF NOT EXISTS idx_user_organizations_org_id ON public.user_organizations(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_organizations_role ON public.user_organizations(executive_role);

-- Update the delete_user_data function to handle CEO deletion differently
CREATE OR REPLACE FUNCTION public.delete_user_data(user_id_param UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_org RECORD;
  remaining_users_count INTEGER;
  org_name TEXT;
BEGIN
  -- Get user's organization info
  SELECT uo.organization_id, uo.executive_role, o.name
  INTO user_org
  FROM public.user_organizations uo
  JOIN public.organizations o ON uo.organization_id = o.id
  WHERE uo.user_id = user_id_param;
  
  -- If user is not in an organization, just delete their data
  IF user_org IS NULL THEN
    -- Delete user's chat logs
    DELETE FROM public.chatlogs WHERE user_id = user_id_param;
    -- Delete user's profile
    DELETE FROM public.profiles WHERE id = user_id_param;
    RETURN;
  END IF;
  
  -- Count remaining users in the organization (excluding the one being deleted)
  SELECT COUNT(*) INTO remaining_users_count
  FROM public.user_organizations
  WHERE organization_id = user_org.organization_id 
    AND user_id != user_id_param;
  
  -- Log the user leaving
  INSERT INTO public.organization_audit_log (
    organization_id, action_type, triggered_by_user_id, details
  ) VALUES (
    user_org.organization_id, 
    'user_left', 
    user_id_param,
    jsonb_build_object(
      'user_role', user_org.executive_role,
      'remaining_users', remaining_users_count,
      'organization_name', user_org.name
    )
  );
  
  -- If this is the last user, delete the entire organization
  IF remaining_users_count = 0 THEN
    INSERT INTO public.organization_audit_log (
      organization_id, action_type, triggered_by_user_id, details
    ) VALUES (
      user_org.organization_id, 
      'organization_deleted', 
      user_id_param,
      jsonb_build_object(
        'reason', 'last_user_left',
        'organization_name', user_org.name
      )
    );
    
    -- Delete the organization (this will cascade delete user_organizations)
    DELETE FROM public.organizations WHERE id = user_org.organization_id;
    
  -- If user is CEO, just log that organization becomes CEO-less (no succession)
  ELSIF user_org.executive_role = 'CEO' AND remaining_users_count > 0 THEN
    INSERT INTO public.organization_audit_log (
      organization_id, action_type, old_ceo_id, triggered_by_user_id, details
    ) VALUES (
      user_org.organization_id, 
      'ceo_left_organization', 
      user_id_param,
      user_id_param,
      jsonb_build_object(
        'reason', 'ceo_deleted_account',
        'organization_name', user_org.name,
        'organization_now_ceoless', true
      )
    );
  END IF;
  
  -- Delete user's chat logs
  DELETE FROM public.chatlogs WHERE user_id = user_id_param;
  
  -- Delete user's organization relationship
  DELETE FROM public.user_organizations WHERE user_id = user_id_param;
  
  -- Delete user's profile
  DELETE FROM public.profiles WHERE id = user_id_param;
END;
$$;

-- Function to check organization member count
CREATE OR REPLACE FUNCTION public.get_organization_member_count(org_id UUID)
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.user_organizations
  WHERE organization_id = org_id;
$$;

-- Function to validate organization name uniqueness
CREATE OR REPLACE FUNCTION public.check_organization_name_exists(org_name TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.organizations 
    WHERE LOWER(TRIM(name)) = LOWER(TRIM(org_name))
  );
$$;
