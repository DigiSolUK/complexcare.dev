-- Create patient_medical_history table
CREATE TABLE IF NOT EXISTS patient_medical_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  record_type VARCHAR(50) NOT NULL, -- condition, procedure, medication, immunization, allergy, other
  record_date DATE NOT NULL,
  description TEXT NOT NULL,
  provider VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolution_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Create patient_allergies table
CREATE TABLE IF NOT EXISTS patient_allergies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  allergen VARCHAR(255) NOT NULL,
  allergen_type VARCHAR(50) NOT NULL, -- medication, food, environmental, other
  reaction TEXT NOT NULL,
  severity VARCHAR(50) NOT NULL, -- mild, moderate, severe
  onset_date DATE,
  status VARCHAR(50) NOT NULL, -- active, inactive, resolved
  notes TEXT,
