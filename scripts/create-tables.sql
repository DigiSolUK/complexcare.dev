-- Create tables for ComplexCare CRM
-- This script creates the core tables needed for the application,
-- with authentication-specific tables removed or simplified.
-- Assumes "Stack Auth" will manage user sessions, potentially using its own mechanisms or JWTs.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  domain VARCHAR(255) UNIQUE, -- Ensure domain is unique if used for routing/identification
  logo_url TEXT,
  primary_color VARCHAR(7),
  -- Add any tenant-specific settings/configuration here as JSONB or separate columns
  settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Users table (essential for tracking actors)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  avatar_url TEXT,
  -- password_hash VARCHAR(255), -- If Stack Auth requires you to store this. Often, the auth provider handles it.
  stack_auth_id VARCHAR(255) UNIQUE, -- Store the user ID from Stack Auth if it's different from your internal UUID
  email_verified_at TIMESTAMP WITH TIME ZONE,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- User Tenants table (maps users to tenants and their roles within that tenant)
CREATE TABLE IF NOT EXISTS user_tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL, -- Role within the tenant (e.g., 'admin', 'care_professional', 'viewer')
  is_primary BOOLEAN DEFAULT FALSE, -- If a user can belong to multiple tenants, one might be primary
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, tenant_id)
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  nhs_number VARCHAR(20), -- Consider making this UNIQUE per tenant if not globally unique
  address TEXT,
  phone VARCHAR(30),
  email VARCHAR(255),
  gender VARCHAR(50), -- e.g., 'Male', 'Female', 'Other', 'PreferNotToSay'
  status VARCHAR(50) DEFAULT 'active', -- e.g., 'active', 'inactive', 'deceased'
  emergency_contact JSONB, -- { name: "", relationship: "", phone: "" }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Care Professionals table
CREATE TABLE IF NOT EXISTS care_professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL, -- Link to a user account, ensure one user per care_professional
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL, -- e.g., 'Nurse', 'Doctor', 'Carer'
  specialization VARCHAR(255),
  contact_number VARCHAR(30),
  email VARCHAR(255), -- This email might be different from their login user email. Consider UNIQUE per tenant.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  care_professional_id UUID REFERENCES care_professionals(id) ON DELETE SET NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) NOT NULL, -- e.g., 'Scheduled', 'Completed', 'Cancelled', 'NoShow'
  notes TEXT,
  location VARCHAR(255),
  appointment_type VARCHAR(100), -- e.g., 'Consultation', 'Home Visit', 'Telehealth'
  created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT check_end_time_after_start_time CHECK (end_time > start_time)
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL, -- e.g., 'ToDo', 'InProgress', 'Done', 'Blocked'
  priority VARCHAR(20) NOT NULL, -- e.g., 'High', 'Medium', 'Low', 'Urgent'
  due_date TIMESTAMP WITH TIME ZONE,
  assigned_to_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_to_care_professional_id UUID REFERENCES care_professionals(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
  related_entity_type VARCHAR(50), -- e.g., 'Appointment', 'CarePlan', 'Patient'
  related_entity_id UUID,
  created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Care Plans table
CREATE TABLE IF NOT EXISTS care_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(50) NOT NULL, -- e.g., 'Active', 'Inactive', 'Completed', 'Draft'
  created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Medications table
CREATE TABLE IF NOT EXISTS medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  dosage VARCHAR(100) NOT NULL,
  frequency VARCHAR(100) NOT NULL,
  route VARCHAR(100), -- e.g., 'Oral', 'IV', 'Topical'
  start_date DATE NOT NULL,
  end_date DATE,
  prescriber_name VARCHAR(255), -- Could be FK to care_professionals if always internal
  notes TEXT,
  created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL, -- Could be a reference to blob storage URL/key
  file_type VARCHAR(100) NOT NULL, -- MIME type
  file_size_bytes BIGINT NOT NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
  care_professional_id UUID REFERENCES care_professionals(id) ON DELETE SET NULL,
  uploaded_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  category VARCHAR(100), -- e.g., 'Referral', 'LabResult', 'ConsentForm', 'Policy'
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) NOT NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE SET NULL, -- Or care_professional_id or other billable entity
  amount DECIMAL(12, 2) NOT NULL,
  status VARCHAR(50) NOT NULL, -- e.g., 'Draft', 'Sent', 'Paid', 'Overdue', 'Void'
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  notes TEXT,
  created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(tenant_id, invoice_number)
);

-- Invoice Items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(12, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinical Note Categories table
CREATE TABLE IF NOT EXISTS clinical_note_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(tenant_id, name)
);

-- Clinical Notes table
CREATE TABLE IF NOT EXISTS clinical_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  care_professional_id UUID REFERENCES care_professionals(id) ON DELETE SET NULL,
  note_date TIMESTAMP WITH TIME ZONE NOT NULL,
  content TEXT NOT NULL,
  category_id UUID REFERENCES clinical_note_categories(id) ON DELETE SET NULL,
  created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Policies table (for compliance)
CREATE TABLE IF NOT EXISTS policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  version VARCHAR(50) NOT NULL,
  effective_date DATE NOT NULL,
  review_date DATE,
  category VARCHAR(100),
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL, -- Link to the actual document file
  created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Risk Assessments table (for compliance)
CREATE TABLE IF NOT EXISTS risk_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE SET NULL, -- Can be general or patient-specific
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  risk_level VARCHAR(50) NOT NULL, -- e.g., 'Low', 'Medium', 'High'
  mitigation_steps TEXT,
  conducted_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  assessment_date DATE NOT NULL,
  next_review_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY, -- Use BIGSERIAL for high-volume audit logs
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- User performing the action
  action VARCHAR(255) NOT NULL, -- e.g., 'PATIENT_CREATE', 'USER_LOGIN_SUCCESS', 'SETTINGS_UPDATE'
  entity_type VARCHAR(100), -- e.g., 'Patient', 'User', 'Appointment'
  entity_id UUID,
  details JSONB, -- Additional information about the action (e.g., changed fields)
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Features table (system-wide features)
CREATE TABLE IF NOT EXISTS features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE, -- e.g., 'ai_summary', 'advanced_reporting', 'patient_portal'
  description TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tenant Features table (enables/disables features for specific tenants, and tenant-specific settings)
CREATE TABLE IF NOT EXISTS tenant_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  feature_id UUID NOT NULL REFERENCES features(id) ON DELETE CASCADE,
  is_enabled BOOLEAN DEFAULT TRUE,
  settings JSONB, -- Tenant-specific settings for this feature
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, feature_id)
);

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- User who generated the key
  key_hash VARCHAR(255) NOT NULL UNIQUE, -- Store a hash of the key, not the key itself
  prefix VARCHAR(8) NOT NULL UNIQUE, -- First few chars of the key for identification
  name VARCHAR(255),
  permissions JSONB, -- Permissions associated with this key (e.g., ['read:patients', 'write:appointments'])
  expires_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Credentials table (for care professionals' qualifications, licenses, etc.)
CREATE TABLE IF NOT EXISTS credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  care_professional_id UUID NOT NULL REFERENCES care_professionals(id) ON DELETE CASCADE,
  credential_type VARCHAR(100) NOT NULL, -- e.g., 'NMC PIN', 'DBS Check', 'Driving License', 'CPR Certification'
  credential_number VARCHAR(255),
  issue_date DATE,
  expiry_date DATE,
  status VARCHAR(50) NOT NULL, -- e.g., 'Verified', 'PendingReview', 'Expired', 'Rejected'
  verified_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL, -- Link to uploaded document proof
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Payroll Providers table
CREATE TABLE IF NOT EXISTS payroll_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  integration_type VARCHAR(100), -- e.g., 'API', 'CSV_Upload', 'Manual'
  config_details JSONB, -- API endpoint, keys (sensitive data should be in a vault or encrypted)
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Payroll Submissions table
CREATE TABLE IF NOT EXISTS payroll_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  payroll_provider_id UUID REFERENCES payroll_providers(id) ON DELETE SET NULL,
  submission_date DATE NOT NULL,
  pay_period_start DATE NOT NULL,
  pay_period_end DATE NOT NULL,
  status VARCHAR(50) NOT NULL, -- e.g., 'Draft', 'Submitted', 'Processing', 'Completed', 'Failed'
  total_amount DECIMAL(12, 2),
  submitted_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  submission_file_url TEXT, -- Link to submitted file if applicable
  response_details TEXT, -- Response from payroll provider
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timesheets table
CREATE TABLE IF NOT EXISTS timesheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  care_professional_id UUID NOT NULL REFERENCES care_professionals(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL, -- Optional link to an appointment
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  break_duration_minutes INTEGER DEFAULT 0,
  total_hours DECIMAL(5, 2) GENERATED ALWAYS AS (
    GREATEST(0, EXTRACT(EPOCH FROM (end_time - start_time)) / 3600.0 - (COALESCE(break_duration_minutes, 0) / 60.0))
  ) STORED,
  status VARCHAR(50) NOT NULL, -- e.g., 'Pending', 'Approved', 'Rejected', 'ProcessedForPayroll'
  notes TEXT,
  approved_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT check_timesheet_end_time_after_start_time CHECK (end_time > start_time)
);

-- Error Logs table (for application errors)
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL, -- Optional, if error is tenant-specific
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Optional, if error is user-specific
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source VARCHAR(255), -- e.g., 'API:/api/patients', 'Frontend:PatientPage', 'BackgroundJob:InvoiceProcessing'
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  request_details JSONB, -- URL, method, headers, body snippet
  severity VARCHAR(50) NOT NULL, -- e.g., 'Info', 'Warning', 'Error', 'Critical'
  status VARCHAR(50) DEFAULT 'Unresolved', -- e.g., 'Unresolved', 'Investigating', 'Resolved', 'Ignored'
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL
);

-- AI Tool Usage Logs table
CREATE TABLE IF NOT EXISTS ai_tool_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  tool_name VARCHAR(255) NOT NULL, -- e.g., 'PatientInquiry', 'DocumentSummary', 'CarePlanGenerator'
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  request_payload JSONB,
  response_payload JSONB,
  duration_ms INTEGER,
  cost DECIMAL(10, 5), -- If tracking cost per API call
  status VARCHAR(50) NOT NULL, -- e.g., 'Success', 'Failure'
  error_message TEXT
);

-- Wearable Devices table
CREATE TABLE IF NOT EXISTS wearable_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  device_type VARCHAR(100) NOT NULL, -- e.g., 'Fitbit', 'Apple Watch', 'Continuous Glucose Monitor'
  device_identifier VARCHAR(255) NOT NULL, -- Serial number or unique ID from device
  model_name VARCHAR(100),
  manufacturer VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Active', -- e.g., 'Active', 'Inactive', 'NeedsRepair', 'Disconnected'
  last_sync_at TIMESTAMP WITH TIME ZONE,
  paired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(tenant_id, patient_id, device_identifier)
);

-- Wearable Readings table
CREATE TABLE IF NOT EXISTS wearable_readings (
  id BIGSERIAL PRIMARY KEY, -- Using BIGSERIAL for high-volume data
  wearable_device_id UUID NOT NULL REFERENCES wearable_devices(id) ON DELETE CASCADE,
  reading_type VARCHAR(100) NOT NULL, -- e.g., 'HeartRate', 'Steps', 'SleepDuration', 'BloodGlucose'
  value TEXT NOT NULL, -- Flexible for various data types, consider JSONB if complex (e.g., for structured sleep data)
  unit VARCHAR(50),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL, -- Time of the reading itself
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- Time record was ingested into our system
);

-- Integration Settings table (for third-party integrations like GP Connect, Office365)
CREATE TABLE IF NOT EXISTS integration_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  integration_name VARCHAR(100) NOT NULL, -- e.g., 'GPConnect', 'Office365Calendar', 'XeroPayroll'
  is_enabled BOOLEAN DEFAULT FALSE,
  settings JSONB, -- API keys, URLs, tokens, refresh tokens (sensitive data should be in a vault or encrypted at rest)
  last_successful_sync TIMESTAMP WITH TIME ZONE,
  last_sync_status VARCHAR(50), -- 'Success', 'Failed', 'InProgress'
  last_sync_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, integration_name)
);

-- Availability Slots table (for care professionals' general availability)
CREATE TABLE IF NOT EXISTS availability_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  care_professional_id UUID NOT NULL REFERENCES care_professionals(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  slot_type VARCHAR(50) DEFAULT 'Available', -- e.g., 'Available', 'Booked', 'Unavailable', 'Tentative'
  recurring_pattern JSONB, -- For recurring availability (e.g., RRule string or custom JSON like { type: 'weekly', days: [1,3,5], startTime: '09:00', endTime: '17:00', until: 'YYYY-MM-DD'})
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT check_availability_end_time_after_start_time CHECK (end_time > start_time)
);

-- Time Off Requests table (for care professionals)
CREATE TABLE IF NOT EXISTS time_off_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  care_professional_id UUID NOT NULL REFERENCES care_professionals(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  reason TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- e.g., 'Pending', 'Approved', 'Rejected', 'Cancelled'
  approved_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT check_time_off_end_time_after_start_time CHECK (end_time > start_time)
);

-- Create indexes for performance
-- Tenants
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_deleted_at ON tenants(deleted_at NULLS FIRST);

-- Users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_stack_auth_id ON users(stack_auth_id);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at NULLS FIRST);

-- User Tenants
CREATE INDEX IF NOT EXISTS idx_user_tenants_user_id ON user_tenants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tenants_tenant_id ON user_tenants(tenant_id);

-- Patients
CREATE INDEX IF NOT EXISTS idx_patients_tenant_id_name ON patients(tenant_id, last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_patients_nhs_number ON patients(nhs_number);
CREATE INDEX IF NOT EXISTS idx_patients_deleted_at ON patients(deleted_at NULLS FIRST);

-- Care Professionals
CREATE INDEX IF NOT EXISTS idx_care_professionals_tenant_id_name ON care_professionals(tenant_id, last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_care_professionals_user_id ON care_professionals(user_id);
CREATE INDEX IF NOT EXISTS idx_care_professionals_email ON care_professionals(email);

-- Appointments
CREATE INDEX IF NOT EXISTS idx_appointments_tenant_id_patient_id_start_time ON appointments(tenant_id, patient_id, start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_tenant_id_cp_id_start_time ON appointments(tenant_id, care_professional_id, start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Tasks
CREATE INDEX IF NOT EXISTS idx_tasks_tenant_id_status_due_date ON tasks(tenant_id, status, due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to_user_id ON tasks(assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_patient_id ON tasks(patient_id);

-- Audit Logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id_created_at ON audit_logs(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id_created_at ON audit_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type_entity_id ON audit_logs(entity_type, entity_id);

-- Wearable Readings (Crucial for time-series data)
CREATE INDEX IF NOT EXISTS idx_wearable_readings_device_id_timestamp ON wearable_readings(wearable_device_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_wearable_readings_type_timestamp ON wearable_readings(reading_type, timestamp DESC);

-- Timesheets
CREATE INDEX IF NOT EXISTS idx_timesheets_tenant_cp_period ON timesheets(tenant_id, care_professional_id, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_timesheets_status ON timesheets(status);
