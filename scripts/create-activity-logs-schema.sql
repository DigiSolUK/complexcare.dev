-- Create activity_logs table for tracking patient activities
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  user_id UUID,
  patient_id UUID,
  activity_type VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB,
  
  CONSTRAINT fk_tenant
    FOREIGN KEY(tenant_id)
    REFERENCES tenants(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE SET NULL,
    
  CONSTRAINT fk_patient
    FOREIGN KEY(patient_id)
    REFERENCES patients(id)
    ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_tenant_id ON activity_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_patient_id ON activity_logs(patient_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_activity_type ON activity_logs(activity_type);

-- Add a function to automatically log patient activities
CREATE OR REPLACE FUNCTION log_patient_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_logs (
    tenant_id,
    patient_id,
    activity_type,
    description
  ) VALUES (
    NEW.tenant_id,
    NEW.id,
    CASE
      WHEN TG_OP = 'INSERT' THEN 'patient_created'
      WHEN TG_OP = 'UPDATE' THEN 'patient_updated'
      ELSE 'patient_action'
    END,
    'Patient record ' || TG_OP || 'd'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for patient table
DROP TRIGGER IF EXISTS patient_activity_trigger ON patients;
CREATE TRIGGER patient_activity_trigger
AFTER INSERT OR UPDATE ON patients
FOR EACH ROW
EXECUTE FUNCTION log_patient_activity();

-- Add sample data if needed
INSERT INTO activity_logs (tenant_id, patient_id, activity_type, description)
SELECT 
  p.tenant_id,
  p.id,
  'visit',
  'Regular checkup visit'
FROM patients p
LIMIT 20;

INSERT INTO activity_logs (tenant_id, patient_id, activity_type, description)
SELECT 
  p.tenant_id,
  p.id,
  'assessment',
  'Health assessment completed'
FROM patients p
LIMIT 15;

INSERT INTO activity_logs (tenant_id, patient_id, activity_type, description)
SELECT 
  p.tenant_id,
  p.id,
  'medication',
  'Medication review completed'
FROM patients p
LIMIT 25;
