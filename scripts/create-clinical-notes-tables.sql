-- Create clinical_note_categories table
CREATE TABLE IF NOT EXISTS clinical_note_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create clinical_note_templates table
CREATE TABLE IF NOT EXISTS clinical_note_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES clinical_note_categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create clinical_notes table
CREATE TABLE IF NOT EXISTS clinical_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    care_professional_id UUID NOT NULL REFERENCES care_professionals(id) ON DELETE RESTRICT,
    category_id UUID NOT NULL REFERENCES clinical_note_categories(id) ON DELETE RESTRICT,
    template_id UUID REFERENCES clinical_note_templates(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    note_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_clinical_notes_tenant_id ON clinical_notes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_clinical_notes_patient_id ON clinical_notes(patient_id);
CREATE INDEX IF NOT EXISTS idx_clinical_notes_care_professional_id ON clinical_notes(care_professional_id);
CREATE INDEX IF NOT EXISTS idx_clinical_notes_category_id ON clinical_notes(category_id);
CREATE INDEX IF NOT EXISTS idx_clinical_note_categories_tenant_id ON clinical_note_categories(tenant_id);
CREATE INDEX IF NOT EXISTS idx_clinical_note_templates_tenant_id ON clinical_note_templates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_clinical_note_templates_category_id ON clinical_note_templates(category_id);
