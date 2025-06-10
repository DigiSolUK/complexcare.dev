-- Seed default data for ComplexCare CRM
-- This script inserts initial data needed for the application to function

-- Insert default tenant
INSERT INTO tenants (id, name, slug, domain, primary_color)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Default Tenant', 'default', 'example.com', '#4f46e5')
ON CONFLICT (id) DO NOTHING;

-- Insert default features
INSERT INTO features (id, name, description, is_premium)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'patient_management', 'Patient management functionality', false),
  ('00000000-0000-0000-0000-000000000002', 'appointment_scheduling', 'Appointment scheduling functionality', false),
  ('00000000-0000-0000-0000-000000000003', 'task_management', 'Task management functionality', false),
  ('00000000-0000-0000-0000-000000000004', 'document_management', 'Document management functionality', false),
  ('00000000-0000-0000-0000-000000000005', 'invoicing', 'Invoicing functionality', false),
  ('00000000-0000-0000-0000-000000000006', 'clinical_notes', 'Clinical notes functionality', false),
  ('00000000-0000-0000-0000-000000000007', 'care_plans', 'Care plans functionality', false),
  ('00000000-0000-0000-0000-000000000008', 'medications', 'Medications management', false),
  ('00000000-0000-0000-0000-000000000009', 'compliance', 'Compliance management', true),
  ('00000000-0000-0000-0000-000000000010', 'analytics', 'Analytics and reporting', true),
  ('00000000-0000-0000-0000-000000000011', 'ai_tools', 'AI-powered tools', true),
  ('00000000-0000-0000-0000-000000000012', 'api_access', 'API access', true)
ON CONFLICT (name) DO NOTHING;

-- Enable all features for default tenant
INSERT INTO tenant_features (tenant_id, feature_id, is_enabled)
SELECT 
  '00000000-0000-0000-0000-000000000001', 
  id, 
  true
FROM 
  features
ON CONFLICT (tenant_id, feature_id) DO NOTHING;

-- Insert default clinical note categories
INSERT INTO clinical_note_categories (id, tenant_id, name, description)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'General', 'General clinical notes'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Assessment', 'Patient assessment notes'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Treatment', 'Treatment notes'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Medication', 'Medication-related notes'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Progress', 'Progress notes')
ON CONFLICT (id) DO NOTHING;

-- Insert default compliance policies
INSERT INTO policies (id, tenant_id, title, content, version, effective_date)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Data Protection Policy', 'This policy outlines how patient data is protected...', '1.0', '2023-01-01'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Information Security Policy', 'This policy outlines information security measures...', '1.0', '2023-01-01'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Patient Confidentiality Policy', 'This policy outlines patient confidentiality requirements...', '1.0', '2023-01-01')
ON CONFLICT (id) DO NOTHING;
