-- Set search path to public to ensure we're working in the default schema
SET search_path TO public;

-- Define the hardcoded IDs and email for clarity and reusability
DO $$
DECLARE
    default_tenant_id UUID := 'ba367cfe-6de0-4180-9566-1002b75cf82c';
    default_admin_user_id UUID := 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
    default_admin_email TEXT := 'admin@example.com';

    -- Declare variables for generated IDs to link data
    patient_alice_id UUID;
    patient_bob_id UUID;
    cp_sarah_id UUID;
    cp_james_id UUID;
BEGIN
    -- Step 1: Clean up existing data that might conflict with our hardcoded IDs or email
    -- Delete from dependent tables first to avoid foreign key violations.
    DELETE FROM patient_notes WHERE tenant_id = default_tenant_id;
    DELETE FROM care_plans WHERE tenant_id = default_tenant_id;
    DELETE FROM medications WHERE tenant_id = default_tenant_id;
    DELETE FROM appointments WHERE tenant_id = default_tenant_id;
    DELETE FROM tasks WHERE tenant_id = default_tenant_id;
    DELETE FROM documents WHERE tenant_id = default_tenant_id;
    DELETE FROM professional_credentials WHERE user_id IN (SELECT id FROM care_professionals WHERE tenant_id = default_tenant_id);
    DELETE FROM patient_assignments WHERE tenant_id = default_tenant_id;

    -- Delete care_professionals entries linked to the default tenant
    DELETE FROM care_professionals WHERE tenant_id = default_tenant_id;

    -- Delete patients entries linked to the default tenant
    DELETE FROM patients WHERE tenant_id = default_tenant_id;

    -- Delete tenant_users entries linked to the admin email or hardcoded ID
    DELETE FROM tenant_users
    WHERE user_id IN (SELECT id FROM users WHERE email = default_admin_email OR id = default_admin_user_id)
       OR tenant_id = default_tenant_id; -- Also delete any tenant_users for this tenant

    -- Delete the user record itself, targeting by email or hardcoded ID
    DELETE FROM users
    WHERE email = default_admin_email OR id = default_admin_user_id;

    -- Delete the tenant record if it exists with the hardcoded ID
    DELETE FROM tenants WHERE id = default_tenant_id;

    -- Step 2: Insert the default tenant
    INSERT INTO tenants (id, name, slug, domain, status, subscription_tier)
    VALUES (
        default_tenant_id,
        'Default ComplexCare CRM Tenant',
        'default-tenant',
        'default.complexcarecrm.com',
        'active',
        'premium'
    )
    ON CONFLICT (id) DO NOTHING;

    -- Step 3: Insert the default admin user
    INSERT INTO users (id, tenant_id, email, name, role)
    VALUES (
        default_admin_user_id,
        default_tenant_id,
        default_admin_email,
        'Admin User',
        'admin'
    )
    ON CONFLICT (id) DO NOTHING;

    -- Step 4: Establish the tenant_users relationship for the default admin user
    INSERT INTO tenant_users (tenant_id, user_id, role, is_primary)
    VALUES (
        default_tenant_id,
        default_admin_user_id,
        'admin',
        TRUE
    )
    ON CONFLICT (tenant_id, user_id) DO NOTHING;

    -- Step 5: Insert demo patient data
    INSERT INTO patients (
        id, tenant_id, first_name, last_name, date_of_birth, gender,
        contact_number, email, address, medical_record_number, primary_care_provider,
        avatar_url, status, medical_history, allergies, chronic_conditions,
        past_surgeries, family_medical_history, immunizations, created_by, updated_by
    ) VALUES
    (
        uuid_generate_v4(),
        default_tenant_id,
        'Alice',
        'Smith',
        '1985-03-15',
        'Female',
        'alice.smith@example.com',
        'alice.smith@example.com',
        '{"street": "123 Oak Ave", "city": "London", "postcode": "SW1A 0AA", "country": "United Kingdom"}',
        'MRS1001',
        'Dr. Emily White',
        '/placeholder.svg?height=100&width=100',
        'active',
        '{"past_illnesses": ["Childhood Asthma"], "vaccination_status": "Up-to-date"}',
        '["Pollen", "Penicillin"]',
        '["Asthma"]',
        '["Appendectomy (2000)"]',
        '{"mother": {"conditions": ["Diabetes"]}, "father": {"conditions": ["Heart Disease"]}}',
        '["MMR", "Flu (Annual)"]',
        default_admin_user_id,
        default_admin_user_id
    ) RETURNING id INTO patient_alice_id;

    INSERT INTO patients (
        id, tenant_id, first_name, last_name, date_of_birth, gender,
        contact_number, email, address, medical_record_number, primary_care_provider,
        avatar_url, status, medical_history, allergies, chronic_conditions,
        past_surgeries, family_medical_history, immunizations, created_by, updated_by
    ) VALUES
    (
        uuid_generate_v4(),
        default_tenant_id,
        'Bob',
        'Johnson',
        '1970-11-22',
        'Male',
        'bob.johnson@example.com',
        'bob.johnson@example.com',
        '{"street": "45 High St", "city": "Manchester", "postcode": "M1 1AA", "country": "United Kingdom"}',
        'MRS1002',
        'Dr. John Green',
        '/placeholder.svg?height=100&width=100',
        'active',
        '{"past_illnesses": ["Hypertension"], "lifestyle": "Sedentary"}',
        '["Dust Mites"]',
        '["Hypertension", "Type 2 Diabetes"]',
        '[]',
        '{"mother": {"conditions": ["Hypertension"]}, "father": {"conditions": ["Diabetes"]}}',
        '["Tetanus", "COVID-19"]',
        default_admin_user_id,
        default_admin_user_id
    ) RETURNING id INTO patient_bob_id;

    INSERT INTO patients (
        id, tenant_id, first_name, last_name, date_of_birth, gender,
        contact_number, email, address, medical_record_number, primary_care_provider,
        avatar_url, status, medical_history, allergies, chronic_conditions,
        past_surgeries, family_medical_history, immunizations, created_by, updated_by
    ) VALUES
    (
        uuid_generate_v4(),
        default_tenant_id,
        'Charlie',
        'Brown',
        '1995-07-01',
        'Non-binary',
        'charlie.brown@example.com',
        'charlie.brown@example.com',
        '{"street": "789 Elm Rd", "city": "Birmingham", "postcode": "B2 4AA", "country": "United Kingdom"}',
        'MRS1003',
        'Dr. Sarah Blue',
        '/placeholder.svg?height=100&width=100',
        'active',
        '{"past_illnesses": ["Anxiety"], "mental_health_history": "Therapy in 2020"}',
        '[]',
        '["Anxiety"]',
        '[]',
        '{"mother": {"conditions": ["Anxiety"]}}',
        '["HPV"]',
        default_admin_user_id,
        default_admin_user_id
    );

    -- Step 6: Insert demo care professionals
    INSERT INTO care_professionals (
        id, tenant_id, first_name, last_name, email, role, phone, specialization,
        qualification, license_number, employment_status, start_date, is_active,
        address, notes, emergency_contact_name, emergency_contact_phone, avatar_url,
        created_at, updated_at, created_by, updated_by
    ) VALUES
    (
        uuid_generate_v4(),
        default_tenant_id,
        'Sarah',
        'Johnson',
        'sarah.johnson@example.com',
        'Registered Nurse',
        '07700900100',
        'Pediatrics',
        'BSc Nursing',
        'NMC123456',
        'full-time',
        '2018-01-10',
        TRUE,
        '{"street": "101 Nurse Lane", "city": "London", "postcode": "SW1A 3BB", "country": "United Kingdom"}',
        'Experienced pediatric nurse.',
        'John Johnson',
        '07700900101',
        '/placeholder.svg?height=100&width=100',
        NOW(),
        NOW(),
        default_admin_user_id,
        default_admin_user_id
    ) RETURNING id INTO cp_sarah_id;

    INSERT INTO care_professionals (
        id, tenant_id, first_name, last_name, email, role, phone, specialization,
        qualification, license_number, employment_status, start_date, is_active,
        address, notes, emergency_contact_name, emergency_contact_phone, avatar_url,
        created_at, updated_at, created_by, updated_by
    ) VALUES
    (
        uuid_generate_v4(),
        default_tenant_id,
        'James',
        'Williams',
        'james.williams@example.com',
        'Physiotherapist',
        '07700900200',
        'Musculoskeletal',
        'MSc Physiotherapy',
        'HCPC789012',
        'part-time',
        '2020-05-20',
        TRUE,
        '{"street": "202 Physio Road", "city": "Manchester", "postcode": "M1 2CC", "country": "United Kingdom"}',
        'Specializes in sports injuries.',
        'Jane Williams',
        '07700900201',
        '/placeholder.svg?height=100&width=100',
        NOW(),
        NOW(),
        default_admin_user_id,
        default_admin_user_id
    ) RETURNING id INTO cp_james_id;

    -- Step 7: Insert demo appointments
    INSERT INTO appointments (
        id, tenant_id, patient_id, care_professional_id, appointment_date,
        appointment_time, duration_minutes, appointment_type, status, notes,
        created_by, updated_by
    ) VALUES
    (
        uuid_generate_v4(),
        default_tenant_id,
        patient_alice_id,
        cp_sarah_id,
        CURRENT_DATE + INTERVAL '1 day',
        '10:00:00',
        60,
        'Home Visit',
        'scheduled',
        'Follow-up for asthma management.',
        default_admin_user_id,
        default_admin_user_id
    ),
    (
        uuid_generate_v4(),
        default_tenant_id,
        patient_bob_id,
        cp_james_id,
        CURRENT_DATE + INTERVAL '2 days',
        '14:30:00',
        45,
        'Clinic Appointment',
        'scheduled',
        'Physiotherapy session for back pain.',
        default_admin_user_id,
        default_admin_user_id
    );

    -- Step 8: Insert demo medications
    INSERT INTO medications (
        id, tenant_id, patient_id, name, dosage, frequency, start_date, end_date,
        status, notes, created_by, updated_by
    ) VALUES
    (
        uuid_generate_v4(),
        default_tenant_id,
        patient_alice_id,
        'Salbutamol Inhaler',
        '100mcg',
        'As needed',
        CURRENT_DATE - INTERVAL '30 days',
        NULL,
        'active',
        'For asthma relief.',
        default_admin_user_id,
        default_admin_user_id
    ),
    (
        uuid_generate_v4(),
        default_tenant_id,
        patient_bob_id,
        'Metformin',
        '500mg',
        'Twice daily',
        CURRENT_DATE - INTERVAL '60 days',
        NULL,
        'active',
        'For Type 2 Diabetes.',
        default_admin_user_id,
        default_admin_user_id
    );

    -- Step 9: Insert demo tasks
    INSERT INTO tasks (
        id, tenant_id, title, description, status, priority, due_date,
        assigned_to, created_by, updated_by
    ) VALUES
    (
        uuid_generate_v4(),
        default_tenant_id,
        'Order new supplies',
        'Order new PPE and medical supplies for the next month.',
        'pending',
        'high',
        CURRENT_DATE + INTERVAL '7 days',
        default_admin_user_id,
        default_admin_user_id,
        default_admin_user_id
    ),
    (
        uuid_generate_v4(),
        default_tenant_id,
        'Update patient records',
        'Review and update medical history for all active patients.',
        'in-progress',
        'medium',
        CURRENT_DATE + INTERVAL '14 days',
        cp_sarah_id,
        default_admin_user_id,
        default_admin_user_id
    );

    -- Step 10: Insert demo documents
    INSERT INTO documents (
        id, tenant_id, title, document_type, content, status,
        created_by, updated_by
    ) VALUES
    (
        uuid_generate_v4(),
        default_tenant_id,
        'Patient Onboarding Guide',
        'policy',
        'This document outlines the steps for onboarding new patients.',
        'published',
        default_admin_user_id,
        default_admin_user_id
    ),
    (
        uuid_generate_v4(),
        default_tenant_id,
        'Emergency Contact Protocol',
        'protocol',
        'Procedure for contacting emergency services and next of kin.',
        'published',
        default_admin_user_id,
        default_admin_user_id
    );

    -- Step 11: Insert demo professional credentials
    INSERT INTO professional_credentials (
        id, user_id, credential_type, credential_number, issue_date, expiry_date,
        issuing_authority, verification_status, created_by, updated_by
    ) VALUES
    (
        uuid_generate_v4(),
        cp_sarah_id,
        'Nursing Registration',
        'NMC123456',
        '2018-01-01',
        CURRENT_DATE + INTERVAL '365 days',
        'Nursing and Midwifery Council',
        'verified',
        default_admin_user_id,
        default_admin_user_id
    ),
    (
        uuid_generate_v4(),
        cp_james_id,
        'HCPC Registration',
        'HCPC789012',
        '2020-05-01',
        CURRENT_DATE + INTERVAL '300 days',
        'Health and Care Professions Council',
        'verified',
        default_admin_user_id,
        default_admin_user_id
    );

    -- Step 12: Insert demo patient notes
    INSERT INTO patient_notes (
        id, tenant_id, patient_id, care_professional_id, note_type, content,
        created_by, updated_by
    ) VALUES
    (
        uuid_generate_v4(),
        default_tenant_id,
        patient_alice_id,
        cp_sarah_id,
        'Progress Note',
        'Patient reported feeling better after adjusting medication. No acute issues.',
        default_admin_user_id,
        default_admin_user_id
    ),
    (
        uuid_generate_v4(),
        default_tenant_id,
        patient_bob_id,
        cp_james_id,
        'Assessment Note',
        'Initial physiotherapy assessment. Identified lower back stiffness.',
        default_admin_user_id,
        default_admin_user_id
    );

    -- Step 13: Insert demo care plans
    INSERT INTO care_plans (
        id, tenant_id, patient_id, title, description, start_date, end_date,
        status, created_by, updated_by
    ) VALUES
    (
        uuid_generate_v4(),
        default_tenant_id,
        patient_alice_id,
        'Asthma Management Plan',
        'Comprehensive plan for managing Alice''s asthma, including medication schedule and emergency protocols.',
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '180 days',
        'active',
        default_admin_user_id,
        default_admin_user_id
    ),
    (
        uuid_generate_v4(),
        default_tenant_id,
        patient_bob_id,
        'Diabetes Care Plan',
        'Plan for Bob''s Type 2 Diabetes, focusing on diet, exercise, and medication adherence.',
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '365 days',
        'active',
        default_admin_user_id,
        default_admin_user_id
    );

END $$;
