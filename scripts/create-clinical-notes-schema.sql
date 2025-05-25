-- Create clinical note categories table
CREATE TABLE IF NOT EXISTS clinical_note_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(20),
  icon VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clinical notes table
CREATE TABLE IF NOT EXISTS clinical_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category_id UUID REFERENCES clinical_note_categories(id),
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_private BOOLEAN DEFAULT FALSE,
  is_important BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  follow_up_date DATE,
  follow_up_notes TEXT
);

-- Create clinical note templates table
CREATE TABLE IF NOT EXISTS clinical_note_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category_id UUID REFERENCES clinical_note_categories(id),
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clinical note attachments table
CREATE TABLE IF NOT EXISTS clinical_note_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID NOT NULL REFERENCES clinical_notes(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(1000) NOT NULL,
  file_type VARCHAR(100),
  file_size BIGINT,
  uploaded_by UUID NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  content_type VARCHAR(100)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clinical_notes_patient_id ON clinical_notes(patient_id);
CREATE INDEX IF NOT EXISTS idx_clinical_notes_category_id ON clinical_notes(category_id);
CREATE INDEX IF NOT EXISTS idx_clinical_notes_created_by ON clinical_notes(created_by);
CREATE INDEX IF NOT EXISTS idx_clinical_notes_tenant_id ON clinical_notes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_clinical_note_categories_tenant_id ON clinical_note_categories(tenant_id);
CREATE INDEX IF NOT EXISTS idx_clinical_note_templates_tenant_id ON clinical_note_templates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_clinical_note_templates_category_id ON clinical_note_templates(category_id);
CREATE INDEX IF NOT EXISTS idx_clinical_note_attachments_note_id ON clinical_note_attachments(note_id);
