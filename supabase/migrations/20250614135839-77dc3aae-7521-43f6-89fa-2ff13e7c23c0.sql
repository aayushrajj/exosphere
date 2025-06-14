
-- Enable Row Level Security on all tables (some may already be enabled)
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveryissues ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatlogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendarevents ENABLE ROW LEVEL SECURITY;
ALTER TABLE sentemails ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to read departments" ON departments;
DROP POLICY IF EXISTS "Allow authenticated users to read metrics" ON metrics;
DROP POLICY IF EXISTS "Allow authenticated users to read deliveryissues" ON deliveryissues;
DROP POLICY IF EXISTS "Allow users to manage their own chatlogs" ON chatlogs;
DROP POLICY IF EXISTS "Allow authenticated users to manage calendarevents" ON calendarevents;
DROP POLICY IF EXISTS "Allow authenticated users to manage sentemails" ON sentemails;

-- DEPARTMENTS: Read-only for all authenticated users
CREATE POLICY "Authenticated users can read departments" ON departments
  FOR SELECT TO authenticated USING (true);

-- METRICS: Read-only for all authenticated users  
CREATE POLICY "Authenticated users can read metrics" ON metrics
  FOR SELECT TO authenticated USING (true);

-- DELIVERY ISSUES: Full access for authenticated users (business data)
CREATE POLICY "Authenticated users can read delivery issues" ON deliveryissues
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert delivery issues" ON deliveryissues
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update delivery issues" ON deliveryissues
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete delivery issues" ON deliveryissues
  FOR DELETE TO authenticated USING (true);

-- CHAT LOGS: Users can only access their own chat logs
CREATE POLICY "Users can view their own chat logs" ON chatlogs
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat logs" ON chatlogs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat logs" ON chatlogs
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat logs" ON chatlogs
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- CALENDAR EVENTS: Full access for authenticated users (shared business resource)
CREATE POLICY "Authenticated users can read calendar events" ON calendarevents
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert calendar events" ON calendarevents
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update calendar events" ON calendarevents
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete calendar events" ON calendarevents
  FOR DELETE TO authenticated USING (true);

-- SENT EMAILS: Full access for authenticated users (business data)
CREATE POLICY "Authenticated users can read sent emails" ON sentemails
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert sent emails" ON sentemails
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update sent emails" ON sentemails
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete sent emails" ON sentemails
  FOR DELETE TO authenticated USING (true);
