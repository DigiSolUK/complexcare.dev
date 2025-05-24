-- Check if the patient_assignments table exists
CREATE TABLE IF NOT EXISTS patient_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  care_professional_id UUID NOT NULL,
  assignment_type VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  updated_by UUID,
  UNIQUE(tenant_id, patient_id, care_professional_id, assignment_type)
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_patient_assignments_patient_id ON patient_assignments(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_assignments_care_professional_id ON patient_assignments(care_professional_id);
CREATE INDEX IF NOT EXISTS idx_patient_assignments_tenant_id ON patient_assignments(tenant_id);

-- Add comment to the table
COMMENT ON TABLE patient_assignments IS 'Stores the assignments of patients to care professionals';
