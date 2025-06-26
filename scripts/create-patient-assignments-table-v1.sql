-- Set search path to public to ensure we're working in the default schema
SET search_path TO public;

-- Create the patient_assignments table
CREATE TABLE IF NOT EXISTS patient_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    care_professional_id UUID NOT NULL REFERENCES care_professionals(id) ON DELETE CASCADE,
    assignment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    status TEXT NOT NULL DEFAULT 'active', -- e.g., 'active', 'inactive', 'transferred'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,

    -- Ensure a patient is assigned to a care professional only once at a time
    UNIQUE (patient_id, care_professional_id, tenant_id, assignment_date)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_patient_assignments_tenant_id ON patient_assignments (tenant_id);
CREATE INDEX IF NOT EXISTS idx_patient_assignments_patient_id ON patient_assignments (patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_assignments_care_professional_id ON patient_assignments (care_professional_id);

-- Add trigger for updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_patient_assignments_updated_at
BEFORE UPDATE ON patient_assignments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add some demo patient assignments to the seed script
DO $$
DECLARE
    default_tenant_id UUID := 'ba367cfe-6de0-4180-9566-1002b75cf82c';
    default_admin_user_id UUID := 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
    patient_alice_id UUID;
    patient_bob_id UUID;
    cp_sarah_id UUID;
    cp_james_id UUID;
BEGIN
    -- Retrieve IDs for existing demo data
    SELECT id INTO patient_alice_id FROM patients WHERE tenant_id = default_tenant_id AND first_name = 'Alice' AND last_name = 'Smith';
    SELECT id INTO patient_bob_id FROM patients WHERE tenant_id = default_tenant_id AND first_name = 'Bob' AND last_name = 'Johnson';
    SELECT id INTO cp_sarah_id FROM care_professionals WHERE tenant_id = default_tenant_id AND first_name = 'Sarah' AND last_name = 'Johnson';
    SELECT id INTO cp_james_id FROM care_professionals WHERE tenant_id = default_tenant_id AND first_name = 'James' AND last_name = 'Williams';

    -- Insert demo patient assignments if IDs are found
    IF patient_alice_id IS NOT NULL AND cp_sarah_id IS NOT NULL THEN
        INSERT INTO patient_assignments (
            tenant_id, patient_id, care_professional_id, assignment_date, status, notes, created_by, updated_by
        ) VALUES (
            default_tenant_id, patient_alice_id, cp_sarah_id, CURRENT_DATE - INTERVAL '30 days', 'active', 'Primary care assignment for general health management.', default_admin_user_id, default_admin_user_id
        )
        ON CONFLICT (patient_id, care_professional_id, tenant_id, assignment_date) DO NOTHING;
    END IF;

    IF patient_bob_id IS NOT NULL AND cp_james_id IS NOT NULL THEN
        INSERT INTO patient_assignments (
            tenant_id, patient_id, care_professional_id, assignment_date, status, notes, created_by, updated_by
        ) VALUES (
            default_tenant_id, patient_bob_id, cp_james_id, CURRENT_DATE - INTERVAL '15 days', 'active', 'Assigned for ongoing physiotherapy sessions.', default_admin_user_id, default_admin_user_id
        )
        ON CONFLICT (patient_id, care_professional_id, tenant_id, assignment_date) DO NOTHING;
    END IF;

END $$;
