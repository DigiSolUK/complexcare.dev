-- Create care_professionals table if it doesn't exist
CREATE TABLE IF NOT EXISTS care_professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(100) NOT NULL,
  specialization VARCHAR(255),
  qualification VARCHAR(255),
  license_number VARCHAR(100),
  employment_status VARCHAR(50),
  start_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  address TEXT,
  notes TEXT,
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(50),
  avatar_url TEXT,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_care_professionals_name ON care_professionals(first_name, last_name);
CREATE INDEX IF NOT EXISTS idx_care_professionals_tenant ON care_professionals(tenant_id);

-- Sample data (only insert if table is empty)
INSERT INTO care_professionals (
  first_name, last_name, email, phone, role, specialization, 
  qualification, license_number, employment_status, start_date, 
  is_active, address, notes, emergency_contact_name, emergency_contact_phone
)
SELECT
  'John', 'Smith', 'john.smith@example.com', '+44 7700 900123', 'Nurse', 'Geriatric Care',
  'RN', 'RN123456', 'Full-time', '2022-01-15',
  TRUE, '123 Main St, London', 'Experienced in dementia care', 'Jane Smith', '+44 7700 900124'
WHERE NOT EXISTS (SELECT 1 FROM care_professionals WHERE email = 'john.smith@example.com');

INSERT INTO care_professionals (
  first_name, last_name, email, phone, role, specialization, 
  qualification, license_number, employment_status, start_date, 
  is_active, address, notes, emergency_contact_name, emergency_contact_phone
)
SELECT
  'Sarah', 'Johnson', 'sarah.johnson@example.com', '+44 7700 900125', 'Physiotherapist', 'Rehabilitation',
  'PT, MSc', 'PT789012', 'Part-time', '2022-03-10',
  TRUE, '456 High St, Manchester', 'Specializes in stroke rehabilitation', 'Michael Johnson', '+44 7700 900126'
WHERE NOT EXISTS (SELECT 1 FROM care_professionals WHERE email = 'sarah.johnson@example.com');

INSERT INTO care_professionals (
  first_name, last_name, email, phone, role, specialization, 
  qualification, license_number, employment_status, start_date, 
  is_active, address, notes, emergency_contact_name, emergency_contact_phone
)
SELECT
  'David', 'Williams', 'david.williams@example.com', '+44 7700 900127', 'Care Assistant', 'Home Care',
  'NVQ Level 3', 'CA345678', 'Full-time', '2022-05-20',
  FALSE, '789 Park Lane, Birmingham', 'On extended leave', 'Emma Williams', '+44 7700 900128'
WHERE NOT EXISTS (SELECT 1 FROM care_professionals WHERE email = 'david.williams@example.com');
