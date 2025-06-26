-- Add created_by and updated_by columns to the patients table
ALTER TABLE patients
ADD COLUMN IF NOT EXISTS created_by VARCHAR(255),
ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255);

-- Optionally, if you want to backfill existing rows with a default 'system' user
-- UPDATE patients SET created_by = 'system' WHERE created_by IS NULL;
-- UPDATE patients SET updated_by = 'system' WHERE updated_by IS NULL;

-- Add indexes for performance if needed (consider if these columns will be frequently queried)
-- CREATE INDEX IF NOT EXISTS idx_patients_created_by ON patients (created_by);
-- CREATE INDEX IF NOT EXISTS idx_patients_updated_by ON patients (updated_by);

-- Add comments for documentation
COMMENT ON COLUMN patients.created_by IS 'ID or identifier of the user who created the patient record.';
COMMENT ON COLUMN patients.updated_by IS 'ID or identifier of the user who last updated the patient record.';
