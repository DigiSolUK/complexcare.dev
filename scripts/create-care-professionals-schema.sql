-- Create care_professionals table
CREATE TABLE IF NOT EXISTS care_professionals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    title TEXT,
    email TEXT,
    phone_number TEXT,
    role TEXT,
    specialization TEXT,
    qualifications TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    address TEXT,
    postcode TEXT,
    notes TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    emergency_contact_relationship TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

-- Create professional_credentials table
CREATE TABLE IF NOT EXISTS professional_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES care_professionals(id),
    credential_type TEXT NOT NULL,
    credential_number TEXT NOT NULL,
    issuing_authority TEXT,
    issue_date DATE,
    expiry_date DATE,
    verification_status TEXT DEFAULT 'pending',
    verification_date TIMESTAMP,
    verified_by UUID,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create patients table if it doesn't exist
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT,
    address TEXT,
    postcode TEXT,
    phone_number TEXT,
    email TEXT,
    nhs_number TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    gp_name TEXT,
    gp_address TEXT,
    gp_phone TEXT,
    medical_conditions TEXT,
    allergies TEXT,
    medications TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

-- Create patient_care_professional table for many-to-many relationship
CREATE TABLE IF NOT EXISTS patient_care_professional (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    patient_id UUID NOT NULL REFERENCES patients(id),
    care_professional_id UUID NOT NULL REFERENCES care_professionals(id),
    relationship_type TEXT,
    start_date DATE,
    end_date DATE,
    is_primary BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(patient_id, care_professional_id)
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    patient_id UUID REFERENCES patients(id),
    care_professional_id UUID REFERENCES care_professionals(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    end_time TIME,
    duration_minutes INTEGER,
    title TEXT,
    appointment_type TEXT,
    status TEXT DEFAULT 'scheduled',
    location TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    cancelled_at TIMESTAMP,
    cancelled_by UUID,
    cancellation_reason TEXT
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    due_date DATE,
    assigned_to_id UUID REFERENCES care_professionals(id),
    created_by UUID,
    related_to_id UUID,
    related_to_type TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    completed_by UUID
);

-- Insert sample data for testing
INSERT INTO care_professionals (id, tenant_id, first_name, last_name, email, role, is_active)
VALUES 
('547bfeec-d7d4-4beb-a60e-80f7d6b97b37', 'ba367cfe-6de0-4180-9566-1002b75cf82c', 'John', 'Smith', 'john.smith@example.com', 'Registered Nurse', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Insert sample credentials
INSERT INTO professional_credentials (tenant_id, user_id, credential_type, credential_number, issuing_authority)
VALUES 
('ba367cfe-6de0-4180-9566-1002b75cf82c', '547bfeec-d7d4-4beb-a60e-80f7d6b97b37', 'License', 'RN123456', 'Nursing and Midwifery Council')
ON CONFLICT DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (tenant_id, title, description, assigned_to_id, due_date)
VALUES 
('ba367cfe-6de0-4180-9566-1002b75cf82c', 'Complete patient assessment', 'Initial assessment for new patient', '547bfeec-d7d4-4beb-a60e-80f7d6b97b37', CURRENT_DATE + INTERVAL '3 days')
ON CONFLICT DO NOTHING;
