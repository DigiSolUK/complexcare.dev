-- Create medication interaction checks table
CREATE TABLE IF NOT EXISTS medication_interaction_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id UUID REFERENCES patients(id),
  medications TEXT[] NOT NULL,
  interactions JSONB,
  checked_by UUID REFERENCES users(id),
  ai_analysis TEXT,
  checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create common drug interactions reference table
CREATE TABLE IF NOT EXISTS common_drug_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drug1 VARCHAR(255) NOT NULL,
  drug2 VARCHAR(255) NOT NULL,
  severity VARCHAR(50) NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe', 'contraindicated')),
  description TEXT NOT NULL,
  mechanism TEXT,
  management TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_interaction_checks_patient ON medication_interaction_checks(patient_id);
CREATE INDEX idx_interaction_checks_tenant ON medication_interaction_checks(tenant_id);
CREATE INDEX idx_common_interactions_drugs ON common_drug_interactions(drug1, drug2);
