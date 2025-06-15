
-- Fix search_path security warnings for all functions

-- Update get_organization_member_count function
CREATE OR REPLACE FUNCTION public.get_organization_member_count(org_id UUID)
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.user_organizations
  WHERE organization_id = org_id;
$$;

-- Update check_organization_name_exists function
CREATE OR REPLACE FUNCTION public.check_organization_name_exists(org_name TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.organizations 
    WHERE LOWER(TRIM(name)) = LOWER(TRIM(org_name))
  );
$$;

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, onboarding_completed)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', FALSE);
  RETURN NEW;
END;
$$;

-- Update delete_organization function
CREATE OR REPLACE FUNCTION public.delete_organization(org_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete all user_organizations records for this organization
  DELETE FROM public.user_organizations WHERE organization_id = org_id;
  
  -- Delete the organization itself
  DELETE FROM public.organizations WHERE id = org_id;
END;
$$;

-- Update delete_user_data function
CREATE OR REPLACE FUNCTION public.delete_user_data(user_id_param UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Update get_next_ceo_candidate function
CREATE OR REPLACE FUNCTION public.get_next_ceo_candidate(org_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_ceo_id UUID;
BEGIN
  -- Priority order: CTO, CFO, VP, COO, Director, Manager, then by creation date (tenure)
  SELECT user_id INTO next_ceo_id
  FROM public.user_organizations
  WHERE organization_id = org_id 
    AND executive_role != 'CEO'
  ORDER BY 
    CASE executive_role
      WHEN 'CTO' THEN 1
      WHEN 'CFO' THEN 2
      WHEN 'VP' THEN 3
      WHEN 'COO' THEN 4
      WHEN 'Director' THEN 5
      WHEN 'Manager' THEN 6
      ELSE 7
    END,
    created_at ASC  -- Longest tenure wins in case of tie
  LIMIT 1;
  
  RETURN next_ceo_id;
END;
$$;

-- Update get_recent_organization_changes function
CREATE OR REPLACE FUNCTION public.get_recent_organization_changes(org_id UUID, since_timestamp TIMESTAMP WITH TIME ZONE DEFAULT (now() - interval '1 hour'))
RETURNS TABLE (
  id UUID,
  action_type TEXT,
  old_ceo_id UUID,
  new_ceo_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    oal.id,
    oal.action_type,
    oal.old_ceo_id,
    oal.new_ceo_id,
    oal.details,
    oal.created_at
  FROM public.organization_audit_log oal
  WHERE oal.organization_id = org_id 
    AND oal.created_at >= since_timestamp
  ORDER BY oal.created_at DESC;
$$;
