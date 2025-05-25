-- This script ensures all required tables and columns exist for the ComplexCare CRM

-- Create patients table if it doesn't exist
CREATE TABLE IF NOT EXISTS patients (
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

-- Create care_professionals table if it doesn't exist
CREATE TABLE IF NOT EXISTS care_professionals (
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

-- Create appointments table if it doesn't exist
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  care_professional_id TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  end_time TIME,
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

-- Create clinical_notes table if it doesn't exist
CREATE TABLE IF NOT EXISTS clinical_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  author_id TEXT NOT NULL,
  category_id TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP,
  deleted_by TEXT
);

-- Create clinical_note_categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS clinical_note_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create clinical_note_templates table if it doesn't exist
CREATE TABLE IF NOT EXISTS clinical_note_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  category_id TEXT,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by TEXT,
  updated_by TEXT
);

-- Create tasks table if it doesn't exist
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  due_date DATE,
  assigned_to TEXT,
  created_by TEXT,
  related_to_id TEXT,
  related_to_type TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  completed_by TEXT
);

-- Create care_plans table if it doesn't exist
CREATE TABLE IF NOT EXISTS care_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active',
  created_by TEXT,
  updated_by TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create medications table if it doesn't exist
CREATE TABLE IF NOT EXISTS medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT,
  start_date DATE,
  end_date DATE,
  prescriber TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by TEXT,
  updated_by TEXT
);

-- Create credentials table if it doesn't exist
CREATE TABLE IF NOT EXISTS credentials (
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

-- Create tenants table if it doesn't exist
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT,
  logo_url TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  subscription_plan TEXT DEFAULT 'basic',
  subscription_status TEXT DEFAULT 'active',
  subscription_start_date TIMESTAMP,
  subscription_end_date TIMESTAMP,
  max_users INTEGER DEFAULT 5,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  role TEXT DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create user_tenants table if it doesn't exist (for multi-tenant support)
CREATE TABLE IF NOT EXISTS user_tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, tenant_id)
);

-- Create invoices table if it doesn't exist
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  invoice_number TEXT NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'draft',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by TEXT,
  updated_by TEXT
);

-- Create invoice_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add foreign key constraints
ALTER TABLE clinical_notes 
  ADD CONSTRAINT IF NOT EXISTS fk_clinical_notes_patient 
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE;

ALTER TABLE clinical_notes 
  ADD CONSTRAINT IF NOT EXISTS fk_clinical_notes_category 
  FOREIGN KEY (category_id) REFERENCES clinical_note_categories(id) ON DELETE SET NULL;

ALTER TABLE appointments 
  ADD CONSTRAINT IF NOT EXISTS fk_appointments_patient 
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE;

ALTER TABLE appointments 
  ADD CONSTRAINT IF NOT EXISTS fk_appointments_care_professional 
  FOREIGN KEY (care_professional_id) REFERENCES care_professionals(id) ON DELETE CASCADE;

ALTER TABLE medications 
  ADD CONSTRAINT IF NOT EXISTS fk_medications_patient 
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE;

ALTER TABLE care_plans 
  ADD CONSTRAINT IF NOT EXISTS fk_care_plans_patient 
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE;

ALTER TABLE credentials 
  ADD CONSTRAINT IF NOT EXISTS fk_credentials_care_professional 
  FOREIGN KEY (care_professional_id) REFERENCES care_professionals(id) ON DELETE CASCADE;

ALTER TABLE user_tenants 
  ADD CONSTRAINT IF NOT EXISTS fk_user_tenants_user 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE user_tenants 
  ADD CONSTRAINT IF NOT EXISTS fk_user_tenants_tenant 
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;

ALTER TABLE invoices 
  ADD CONSTRAINT IF NOT EXISTS fk_invoices_patient 
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE;

ALTER TABLE invoice_items 
  ADD CONSTRAINT IF NOT EXISTS fk_invoice_items_invoice 
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE;

-- Add check constraints
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS chk_appointment_status;
ALTER TABLE appointments ADD CONSTRAINT chk_appointment_status 
  CHECK (status IN ('scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'));

ALTER TABLE tasks DROP CONSTRAINT IF EXISTS chk_task_priority;
ALTER TABLE tasks ADD CONSTRAINT chk_task_priority
  CHECK (priority IN ('low', 'medium', 'high', 'urgent'));

ALTER TABLE tasks DROP CONSTRAINT IF EXISTS chk_task_status;
ALTER TABLE tasks ADD CONSTRAINT chk_task_status
  CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled'));

-- Insert default tenant if none exists
INSERT INTO tenants (id, name, subscription_plan, subscription_status)
SELECT 'ba367cfe-6de0-4180-9566-1002b75cf82c', 'Default Tenant', 'enterprise', 'active'
WHERE NOT EXISTS (SELECT 1 FROM tenants WHERE id = 'ba367cfe-6de0-4180-9566-1002b75cf82c');

-- Insert default clinical note categories
INSERT INTO clinical_note_categories (tenant_id, name, description, color)
VALUES 
('ba367cfe-6de0-4180-9566-1002b75cf82c', 'Assessment', 'Initial and follow-up patient assessments', '#4f46e5'),
('ba367cfe-6de0-4180-9566-1002b75cf82c', 'Treatment', 'Treatment notes and procedures', '#0891b2'),
('ba367cfe-6de0-4180-9566-1002b75cf82c', 'Medication', 'Medication administration and changes', '#059669'),
('ba367cfe-6de0-4180-9566-1002b75cf82c', 'Progress', 'Patient progress notes', '#ca8a04'),
('ba367cfe-6de0-4180-9566-1002b75cf82c', 'Discharge', 'Discharge planning and summaries', '#dc2626')
ON CONFLICT DO NOTHING;

-- Insert default clinical note templates
INSERT INTO clinical_note_templates (tenant_id, category_id, name, content, created_by)
SELECT 
  'ba367cfe-6de0-4180-9566-1002b75cf82c', 
  c.id, 
  'Initial Assessment', 
  '# Initial Assessment\n\n## Presenting Complaint\n\n## History of Present Illness\n\n## Past Medical History\n\n## Medications\n\n## Allergies\n\n## Social History\n\n## Family History\n\n## Review of Systems\n\n## Physical Examination\n\n## Assessment\n\n## Plan\n',
  'system'
FROM clinical_note_categories c 
WHERE c.name = 'Assessment' AND c.tenant_id = 'ba367cfe-6de0-4180-9566-1002b75cf82c'
ON CONFLICT DO NOTHING;

INSERT INTO clinical_note_templates (tenant_id, category_id, name, content, created_by)
SELECT 
  'ba367cfe-6de0-4180-9566-1002b75cf82c', 
  c.id, 
  'Progress Note', 
  '# Progress Note\n\n## Subjective\n\n## Objective\n\n## Assessment\n\n## Plan\n',
  'system'
FROM clinical_note_categories c 
WHERE c.name = 'Progress' AND c.tenant_id = 'ba367cfe-6de0-4180-9566-1002b75cf82c'
ON CONFLICT DO NOTHING;

-- Insert sample data if tables are empty
INSERT INTO patients (tenant_id, first_name, last_name, date_of_birth, gender, nhs_number, is_active)
SELECT 'ba367cfe-6de0-4180-9566-1002b75cf82c', 'John', 'Smith', '1975-05-15', 'Male', 'NHS12345678', true
WHERE NOT EXISTS (SELECT 1 FROM patients LIMIT 1);

INSERT INTO care_professionals (tenant_id, first_name, last_name, role, email, is_active)
SELECT 'ba367cfe-6de0-4180-9566-1002b75cf82c', 'Sarah', 'Johnson', 'Registered Nurse', 'sarah.johnson@example.com', true
WHERE NOT EXISTS (SELECT 1 FROM care_professionals LIMIT 1);
