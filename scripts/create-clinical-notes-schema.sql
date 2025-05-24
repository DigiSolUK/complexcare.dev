-- Check if clinical_note_categories table exists, if not create it
CREATE TABLE IF NOT EXISTS clinical_note_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(20),
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  updated_by UUID,
  CONSTRAINT fk_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Check if clinical_note_templates table exists, if not create it
CREATE TABLE IF NOT EXISTS clinical_note_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  category_id UUID,
  name VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  updated_by UUID,
  CONSTRAINT fk_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES clinical_note_categories(id) ON DELETE SET NULL
);

-- Check if clinical_notes table exists, if not create it
CREATE TABLE IF NOT EXISTS clinical_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  care_professional_id UUID NOT NULL,
  category_id UUID,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  note_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_private BOOLEAN DEFAULT FALSE,
  is_draft BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL,
  updated_by UUID,
  CONSTRAINT fk_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT fk_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  CONSTRAINT fk_care_professional FOREIGN KEY (care_professional_id) REFERENCES care_professionals(id) ON DELETE CASCADE,
  CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES clinical_note_categories(id) ON DELETE SET NULL
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clinical_notes_patient_id ON clinical_notes(patient_id);
CREATE INDEX IF NOT EXISTS idx_clinical_notes_care_professional_id ON clinical_notes(care_professional_id);
CREATE INDEX IF NOT EXISTS idx_clinical_notes_category_id ON clinical_notes(category_id);
CREATE INDEX IF NOT EXISTS idx_clinical_notes_tenant_id ON clinical_notes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_clinical_note_categories_tenant_id ON clinical_note_categories(tenant_id);
CREATE INDEX IF NOT EXISTS idx_clinical_note_templates_tenant_id ON clinical_note_templates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_clinical_note_templates_category_id ON clinical_note_templates(category_id);

-- Insert some default categories if they don't exist
INSERT INTO clinical_note_categories (tenant_id, name, description, color, icon)
SELECT 
  (SELECT id FROM tenants LIMIT 1), 
  'General', 
  'General clinical observations and notes', 
  '#4CAF50', 
  'clipboard'
WHERE NOT EXISTS (
  SELECT 1 FROM clinical_note_categories 
  WHERE name = 'General' AND tenant_id = (SELECT id FROM tenants LIMIT 1)
);

INSERT INTO clinical_note_categories (tenant_id, name, description, color, icon)
SELECT 
  (SELECT id FROM tenants LIMIT 1), 
  'Assessment', 
  'Patient assessment notes', 
  '#2196F3', 
  'stethoscope'
WHERE NOT EXISTS (
  SELECT 1 FROM clinical_note_categories 
  WHERE name = 'Assessment' AND tenant_id = (SELECT id FROM tenants LIMIT 1)
);

INSERT INTO clinical_note_categories (tenant_id, name, description, color, icon)
SELECT 
  (SELECT id FROM tenants LIMIT 1), 
  'Treatment', 
  'Treatment and intervention notes', 
  '#FF9800', 
  'activity'
WHERE NOT EXISTS (
  SELECT 1 FROM clinical_note_categories 
  WHERE name = 'Treatment' AND tenant_id = (SELECT id FROM tenants LIMIT 1)
);

INSERT INTO clinical_note_categories (tenant_id, name, description, color, icon)
SELECT 
  (SELECT id FROM tenants LIMIT 1), 
  'Progress', 
  'Patient progress notes', 
  '#9C27B0', 
  'trending-up'
WHERE NOT EXISTS (
  SELECT 1 FROM clinical_note_categories 
  WHERE name = 'Progress' AND tenant_id = (SELECT id FROM tenants LIMIT 1)
);

-- Insert some default templates if they don't exist
INSERT INTO clinical_note_templates (tenant_id, category_id, name, content)
SELECT 
  (SELECT id FROM tenants LIMIT 1),
  (SELECT id FROM clinical_note_categories WHERE name = 'Assessment' AND tenant_id = (SELECT id FROM tenants LIMIT 1) LIMIT 1),
  'Initial Assessment',
  'Subjective:\n\nObjective:\n\nAssessment:\n\nPlan:'
WHERE NOT EXISTS (
  SELECT 1 FROM clinical_note_templates 
  WHERE name = 'Initial Assessment' AND tenant_id = (SELECT id FROM tenants LIMIT 1)
);

INSERT INTO clinical_note_templates (tenant_id, category_id, name, content)
SELECT 
  (SELECT id FROM tenants LIMIT 1),
  (SELECT id FROM clinical_note_categories WHERE name = 'Progress' AND tenant_id = (SELECT id FROM tenants LIMIT 1) LIMIT 1),
  'Progress Note',
  'Current Status:\n\nChanges Since Last Visit:\n\nInterventions:\n\nNext Steps:'
WHERE NOT EXISTS (
  SELECT 1 FROM clinical_note_templates 
  WHERE name = 'Progress Note' AND tenant_id = (SELECT id FROM tenants LIMIT 1)
);
