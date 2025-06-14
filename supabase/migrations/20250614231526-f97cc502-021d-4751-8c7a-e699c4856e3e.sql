
-- Add comprehensive RLS policies for all tables (using CREATE OR REPLACE to avoid conflicts)

-- RLS policies for organizations table
DROP POLICY IF EXISTS "Users can view organizations they belong to or by org_code" ON public.organizations;
DROP POLICY IF EXISTS "Users can view organizations they belong to" ON public.organizations;
DROP POLICY IF EXISTS "Users can view organizations by org_code for joining" ON public.organizations;

CREATE POLICY "Users can view organizations they belong to" ON public.organizations
  FOR SELECT TO authenticated 
  USING (
    id IN (
      SELECT organization_id FROM public.user_organizations 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view organizations by org_code for joining" ON public.organizations
  FOR SELECT TO authenticated 
  USING (true); -- Allow reading org_code for validation during join

-- RLS policies for user_organizations table
DROP POLICY IF EXISTS "Users can view their own organization relationships" ON public.user_organizations;
DROP POLICY IF EXISTS "Users can create their own organization relationships" ON public.user_organizations;
DROP POLICY IF EXISTS "Users can update their own organization relationships" ON public.user_organizations;

CREATE POLICY "Users can view their own organization relationships" ON public.user_organizations
  FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own organization relationships" ON public.user_organizations
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own organization relationships" ON public.user_organizations
  FOR UPDATE TO authenticated 
  USING (auth.uid() = user_id);

-- RLS policies for profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "Users can create their own profile" ON public.profiles
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated 
  USING (auth.uid() = id);

-- RLS policies for organization_audit_log table
DROP POLICY IF EXISTS "Users can view their organization audit logs" ON public.organization_audit_log;

CREATE POLICY "Users can view their organization audit logs" ON public.organization_audit_log
  FOR SELECT TO authenticated 
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM public.user_organizations 
      WHERE user_id = auth.uid()
    )
  );

-- Add missing indexes for better performance (using IF NOT EXISTS to avoid conflicts)
CREATE INDEX IF NOT EXISTS idx_user_organizations_user_id ON public.user_organizations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_organizations_organization_id ON public.user_organizations(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_audit_log_organization_id ON public.organization_audit_log(organization_id);
CREATE INDEX IF NOT EXISTS idx_chatlogs_user_id ON public.chatlogs(user_id);

-- Add foreign key constraints with proper references (check if they don't exist first)
DO $$
BEGIN
    -- Add organization_audit_log FK if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_organization_audit_log_organization'
        AND table_name = 'organization_audit_log'
    ) THEN
        ALTER TABLE public.organization_audit_log 
        ADD CONSTRAINT fk_organization_audit_log_organization 
        FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;
    END IF;

    -- Add user_organizations FK if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_user_organizations_organization'
        AND table_name = 'user_organizations'
    ) THEN
        ALTER TABLE public.user_organizations 
        ADD CONSTRAINT fk_user_organizations_organization 
        FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;
    END IF;
END $$;
