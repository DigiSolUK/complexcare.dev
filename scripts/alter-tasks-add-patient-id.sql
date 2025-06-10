-- Migration script to add patient_id to the tasks table
-- This script ensures that tasks can be associated with specific patients.

ALTER TABLE tasks
ADD COLUMN patient_id UUID REFERENCES patients(id) ON DELETE SET NULL;

-- Add an index for faster lookups of tasks by patient
CREATE INDEX IF NOT EXISTS idx_tasks_patient_id ON tasks(patient_id);

-- Optional: If you have existing tasks that should be linked to a patient,
-- you might need a separate data migration script here.
-- For now, new tasks will be able to link to patients.
