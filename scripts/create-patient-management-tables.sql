-- Patient Management Tables

-- Medical History Table
CREATE TABLE IF NOT EXISTS patient_medical_history (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    condition_name VARCHAR(255) NOT NULL,
    diagnosis_date DATE,
    resolution_date DATE,
    status VARCHAR(50) NOT NULL, -- Active, Resolved, Chronic, etc.
    notes TEXT,
    severity VARCHAR(50), -- Mild, Moderate, Severe
    diagnosed_by VARCHAR(255),
    treatment_summary TEXT,
    tenant_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Allergies Table
CREATE TABLE IF NOT EXISTS patient_allergies (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    allergen VARCHAR(255) NOT NULL,
    reaction_type VARCHAR(255) NOT NULL,
    severity VARCHAR(50) NOT NULL, -- Mild, Moderate, Severe, Life-threatening
    date_identified DATE,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    tenant_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Patient Documents Table
CREATE TABLE IF NOT EXISTS patient_documents (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL, -- Medical Report, Consent Form, etc.
    file_path VARCHAR(1000) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    is_confidential BOOLEAN DEFAULT FALSE,
    tenant_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Patient Risk Assessment Table
CREATE TABLE IF NOT EXISTS patient_risk_assessments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    assessment_date DATE NOT NULL,
    risk_level VARCHAR(50) NOT NULL, -- Low, Medium, High, Critical
    assessment_type VARCHAR(100) NOT NULL, -- Fall Risk, Pressure Ulcer, etc.
    assessment_score INTEGER,
    assessment_details TEXT,
    next_assessment_date DATE,
    mitigating_actions TEXT,
    tenant_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Patient Contact Information (Extended)
CREATE TABLE IF NOT EXISTS patient_contacts (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    contact_type VARCHAR(50) NOT NULL, -- Emergency, Next of Kin, GP, etc.
    name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    notes TEXT,
    tenant_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Patient Social Determinants of Health
CREATE TABLE IF NOT EXISTS patient_social_determinants (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    category VARCHAR(100) NOT NULL, -- Housing, Transportation, Food Security, etc.
    status VARCHAR(50) NOT NULL, -- Stable, At Risk, Unstable
    details TEXT,
    intervention_needed BOOLEAN DEFAULT FALSE,
    intervention_details TEXT,
    follow_up_date DATE,
    tenant_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_patient_medical_history_patient_id ON patient_medical_history(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_allergies_patient_id ON patient_allergies(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_documents_patient_id ON patient_documents(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_risk_assessments_patient_id ON patient_risk_assessments(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_contacts_patient_id ON patient_contacts(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_social_determinants_patient_id ON patient_social_determinants(patient_id);
