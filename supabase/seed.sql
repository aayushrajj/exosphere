
-- Insert sample departments
INSERT INTO departments (name) VALUES 
  ('Finance'),
  ('Sales'),
  ('Operations'),
  ('HR'),
  ('Delivery');

-- Insert sample metrics
INSERT INTO metrics (name, department_id) VALUES 
  ('Revenue', 1),
  ('Cash Flow', 1),
  ('Monthly Sales', 2),
  ('Lead Conversion Rate', 2),
  ('Operational Efficiency', 3),
  ('Cost Reduction', 3),
  ('Employee Satisfaction', 4),
  ('Turnover Rate', 4),
  ('On-time Delivery', 5),
  ('Customer Satisfaction', 5);

-- Insert sample delivery issues
INSERT INTO delivery_issues (region, issue_description, reported_date) VALUES 
  ('North America', 'Delayed shipments due to weather conditions', '2024-01-15'),
  ('Europe', 'Supply chain disruption affecting delivery times', '2024-01-20'),
  ('Asia Pacific', 'Customs clearance delays impacting schedule', '2024-01-25'),
  ('Latin America', 'Transportation capacity issues in rural areas', '2024-02-01'),
  ('Middle East', 'Regulatory compliance delays at border crossings', '2024-02-05');

-- Insert sample calendar events
INSERT INTO calendar_events (title, start_time, end_time, attendees) VALUES 
  ('Q1 Financial Review', '2024-03-15 09:00:00+00', '2024-03-15 10:30:00+00', ARRAY['CFO', 'Finance Team']),
  ('Sales Pipeline Review', '2024-03-16 14:00:00+00', '2024-03-16 15:00:00+00', ARRAY['Sales Director', 'Regional Managers']),
  ('Operations Planning Meeting', '2024-03-17 11:00:00+00', '2024-03-17 12:00:00+00', ARRAY['COO', 'Operations Team']),
  ('HR Policy Update Session', '2024-03-18 10:00:00+00', '2024-03-18 11:30:00+00', ARRAY['HR Director', 'All Department Heads']),
  ('Delivery Performance Review', '2024-03-19 15:00:00+00', '2024-03-19 16:00:00+00', ARRAY['Logistics Manager', 'Regional Coordinators']);
