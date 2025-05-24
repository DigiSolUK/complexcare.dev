-- Check if care_professionals table exists and create if not
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'care_professionals') THEN
        CREATE TABLE care_professionals (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            tenant_id TEXT NOT NULL,
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
            emergency_contact_relationship TEXT,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            created_by TEXT,
            updated_by TEXT
        );
        RAISE NOTICE 'Created care_professionals table';
    ELSE
        RAISE NOTICE 'care_professionals table already exists';
    END IF;
END
$$;

-- Check if credentials table exists and create if not
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'credentials') THEN
        CREATE TABLE credentials (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            tenant_id TEXT NOT NULL,
            care_professional_id TEXT NOT NULL,
            credential_type TEXT NOT NULL,
            credential_name TEXT NOT NULL,
            issuing_authority TEXT,
            credential_number TEXT,
            issue_date DATE,
            expiry_date DATE,
            verification_status TEXT DEFAULT 'pending',
            verification_date TIMESTAMP,
            verified_by TEXT,
            notes TEXT,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
        RAISE NOTICE 'Created credentials table';
    ELSE
        RAISE NOTICE 'credentials table already exists';
    END IF;
END
$$;

-- Check if tasks table exists and create if not
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tasks') THEN
        CREATE TABLE tasks (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            tenant_id TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'pending',
            priority TEXT DEFAULT 'medium',
            due_date DATE,
            assigned_to TEXT NOT NULL,
            created_by TEXT,
            related_to_id TEXT,
            related_to_type TEXT,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            completed_at TIMESTAMP,
            completed_by TEXT
        );
        RAISE NOTICE 'Created tasks table';
    ELSE
        RAISE NOTICE 'tasks table already exists';
    END IF;
END
$$;

-- Check if appointments table exists and create if not
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'appointments') THEN
        CREATE TABLE appointments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            tenant_id TEXT NOT NULL,
            patient_id TEXT NOT NULL,
            care_professional_id TEXT NOT NULL,
            appointment_date DATE NOT NULL,
            appointment_time TIME NOT NULL,
            duration_minutes INTEGER DEFAULT 60,
            status TEXT DEFAULT 'scheduled',
            appointment_type TEXT,
            location TEXT,
            notes TEXT,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            cancelled_at TIMESTAMP,
            cancelled_by TEXT,
            cancellation_reason TEXT
        );
        RAISE NOTICE 'Created appointments table';
    ELSE
        RAISE NOTICE 'appointments table already exists';
    END IF;
END
$$;

-- Check if patients table exists and create if not
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'patients') THEN
        CREATE TABLE patients (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            tenant_id TEXT NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            date_of_birth DATE,
            gender TEXT,
            address TEXT,
            postcode TEXT,
            phone_number TEXT,
            email TEXT,
            nhs_number TEXT,
            emergency_contact TEXT,
            emergency_phone TEXT,
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
            created_by TEXT,
            updated_by TEXT
        );
        RAISE NOTICE 'Created patients table';
    ELSE
        RAISE NOTICE 'patients table already exists';
    END IF;
END
$$;

-- Add missing columns to care_professionals if needed
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                   WHERE table_name = 'care_professionals' AND column_name = 'is_active') THEN
        ALTER TABLE care_professionals ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
        RAISE NOTICE 'Added is_active column to care_professionals';
    END IF;
END
$$;

-- Add missing columns to tasks if needed
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                   WHERE table_name = 'tasks' AND column_name = 'assigned_to') THEN
        ALTER TABLE tasks ADD COLUMN assigned_to TEXT;
        RAISE NOTICE 'Added assigned_to column to tasks';
    END IF;
END
$$;

-- Add missing columns to credentials if needed
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                   WHERE table_name = 'credentials' AND column_name = 'care_professional_id') THEN
        ALTER TABLE credentials ADD COLUMN care_professional_id TEXT;
        RAISE NOTICE 'Added care_professional_id column to credentials';
    END IF;
END
$$;

-- Insert sample data for testing
INSERT INTO care_professionals (id, tenant_id, first_name, last_name, email, role, is_active)
VALUES 
('547bfeec-d7d4-4beb-a60e-80f7d6b97b37', 'ba367cfe-6de0-4180-9566-1002b75cf82c', 'John', 'Smith', 'john.smith@example.com', 'Registered Nurse', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Insert sample credentials
INSERT INTO credentials (tenant_id, care_professional_id, credential_type, credential_name, issuing_authority)
VALUES 
('ba367cfe-6de0-4180-9566-1002b75cf82c', '547bfeec-d7d4-4beb-a60e-80f7d6b97b37', 'License', 'Registered Nurse License', 'Nursing and Midwifery Council')
ON CONFLICT DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (tenant_id, title, description, assigned_to, due_date)
VALUES 
('ba367cfe-6de0-4180-9566-1002b75cf82c', 'Complete patient assessment', 'Initial assessment for new patient', '547bfeec-d7d4-4beb-a60e-80f7d6b97b37', CURRENT_DATE + INTERVAL '3 days')
ON CONFLICT DO NOTHING;
