-- Create patient medical history table
CREATE TABLE IF NOT EXISTS patient_medical_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL CHECK (category IN (
    'CONDITION', 'SURGERY', 'HOSPITALIZATION', 'PROCEDURE', 
    'IMMUNIZATION', 'FAMILY_HISTORY', 'SOCIAL_HISTORY', 'OTHER'
  )),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  onset_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) NOT NULL CHECK (status IN (
    'ACTIVE', 'RESOLVED', 'RECURRING', 'IN_REMISSION', 'CHRONIC'
  )),
  severity VARCHAR(50) CHECK (severity IN (
    'MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING'
  )),
  provider VARCHAR(255),
  location VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by VARCHAR(255) NOT NULL,
  updated_by VARCHAR(255),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_patient_medical_history_patient_id ON patient_medical_history(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_medical_history_category ON patient_medical_history(category);
CREATE INDEX IF NOT EXISTS idx_patient_medical_history_status ON patient_medical_history(status);
CREATE INDEX IF NOT EXISTS idx_patient_medical_history_onset_date ON patient_medical_history(onset_date);
CREATE INDEX IF NOT EXISTS idx_patient_medical_history_tenant_id ON patient_medical_history(tenant_id);

-- Create table for medical history attachments
CREATE TABLE IF NOT EXISTS patient_medical_history_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medical_history_id UUID NOT NULL REFERENCES patient_medical_history(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(1024) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  uploaded_by VARCHAR(255) NOT NULL,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_medical_history_attachments_history_id ON patient_medical_history_attachments(medical_history_id);
CREATE INDEX IF NOT EXISTS idx_medical_history_attachments_tenant_id ON patient_medical_history_attachments(tenant_id);
