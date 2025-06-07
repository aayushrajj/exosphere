
-- Create Departments table
CREATE TABLE departments (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Metrics table
CREATE TABLE metrics (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  department_id BIGINT REFERENCES departments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Delivery Issues table
CREATE TABLE deliveryissues (
  id BIGSERIAL PRIMARY KEY,
  region TEXT NOT NULL,
  issue_description TEXT NOT NULL,
  reported_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Chat Logs table
CREATE TABLE chatlogs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create Calendar Events table
CREATE TABLE calendarevents (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  attendees TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Sent Emails table
CREATE TABLE sentemails (
  id BIGSERIAL PRIMARY KEY,
  department TEXT NOT NULL,
  metric TEXT NOT NULL,
  draft TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveryissues ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatlogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendarevents ENABLE ROW LEVEL SECURITY;
ALTER TABLE sentemails ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to read departments" ON departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to read metrics" ON metrics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to read deliveryissues" ON deliveryissues FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow users to manage their own chatlogs" ON chatlogs FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to manage calendarevents" ON calendarevents FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage sentemails" ON sentemails FOR ALL TO authenticated USING (true);
