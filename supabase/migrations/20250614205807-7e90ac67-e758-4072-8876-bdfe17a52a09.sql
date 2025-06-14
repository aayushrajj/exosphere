
-- Drop existing RLS policies on chatlogs table
DROP POLICY IF EXISTS "Users can view their own chat logs" ON chatlogs;
DROP POLICY IF EXISTS "Users can insert their own chat logs" ON chatlogs;
DROP POLICY IF EXISTS "Users can update their own chat logs" ON chatlogs;
DROP POLICY IF EXISTS "Users can delete their own chat logs" ON chatlogs;

-- Create optimized RLS policies with SELECT wrapper around auth.uid()
CREATE POLICY "Users can view their own chat logs" ON chatlogs
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert their own chat logs" ON chatlogs
  FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own chat logs" ON chatlogs
  FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own chat logs" ON chatlogs
  FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);
