
-- Add session_id column to chatlogs table
ALTER TABLE chatlogs ADD COLUMN session_id TEXT DEFAULT 'default';
