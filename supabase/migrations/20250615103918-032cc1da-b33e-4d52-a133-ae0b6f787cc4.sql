
-- Fix performance warnings in RLS policies and indexes

-- Drop duplicate index (keep the more descriptive one)
DROP INDEX IF EXISTS idx_user_organizations_org_id;

-- Fix RLS policies by using (select auth.uid()) for better performance

-- Fix organizations table policies - consolidate the multiple SELECT policies
DROP POLICY IF EXISTS "Users can view organizations they belong to" ON public.organizations;
DROP POLICY IF EXISTS "Users can view organizations by org_code for joining" ON public.organizations;

CREATE POLICY "Users can view organizations they belong to or by org_code" ON public.organizations
  FOR SELECT TO authenticated 
  USING (
    id IN (
      SELECT organization_id FROM public.user_organizations 
      WHERE user_id = (SELECT auth.uid())
    )
    OR true  -- Allow reading for org_code validation during join
  );

-- Fix CEO delete policy
DROP POLICY IF EXISTS "Only CEO can delete organization" ON public.organizations;

CREATE POLICY "Only CEO can delete organization" ON public.organizations
  FOR DELETE TO authenticated
  USING (
    id IN (
      SELECT organization_id 
      FROM public.user_organizations 
      WHERE user_id = (SELECT auth.uid()) 
      AND executive_role = 'CEO'
    )
  );

-- Fix user_organizations policies
DROP POLICY IF EXISTS "Users can view their own organization relationships" ON public.user_organizations;
DROP POLICY IF EXISTS "Users can create their own organization relationships" ON public.user_organizations;
DROP POLICY IF EXISTS "Users can update their own organization relationships" ON public.user_organizations;

CREATE POLICY "Users can view their own organization relationships" ON public.user_organizations
  FOR SELECT TO authenticated 
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can create their own organization relationships" ON public.user_organizations
  FOR INSERT TO authenticated 
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own organization relationships" ON public.user_organizations
  FOR UPDATE TO authenticated 
  USING ((SELECT auth.uid()) = user_id);

-- Fix profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own data" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated 
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can create their own profile" ON public.profiles
  FOR INSERT TO authenticated 
  WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated 
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can delete their own data" ON public.profiles
  FOR DELETE TO authenticated
  USING (id = (SELECT auth.uid()));

-- Fix organization_audit_log policy
DROP POLICY IF EXISTS "Users can view their organization audit logs" ON public.organization_audit_log;

CREATE POLICY "Users can view their organization audit logs" ON public.organization_audit_log
  FOR SELECT TO authenticated 
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM public.user_organizations 
      WHERE user_id = (SELECT auth.uid())
    )
  );
