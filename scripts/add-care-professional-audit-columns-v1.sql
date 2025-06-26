-- Add created_by and updated_by columns to care_professionals table
ALTER TABLE care_professionals
ADD COLUMN created_by UUID REFERENCES users(id) DEFAULT NULL,
ADD COLUMN updated_by UUID REFERENCES users(id) DEFAULT NULL;

-- Optional: Add a function to update updated_at and updated_by on row update
CREATE OR REPLACE FUNCTION update_care_professional_audit_columns()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    -- Assuming you have a way to get the current user's ID, e.g., from a session variable or context
    -- For now, setting to NULL or a default if not available
    NEW.updated_by = NULL; -- Replace with actual user ID if available
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a trigger to automatically update updated_at and updated_by
CREATE OR REPLACE TRIGGER update_care_professional_audit_trigger
BEFORE UPDATE ON care_professionals
FOR EACH ROW
EXECUTE FUNCTION update_care_professional_audit_columns();
