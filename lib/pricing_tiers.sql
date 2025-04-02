-- Create pricing_tiers table
CREATE TABLE IF NOT EXISTS pricing_tiers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  monthly_price DECIMAL(10, 2) NOT NULL,
  annual_price DECIMAL(10, 2) NOT NULL,
  features TEXT[] NOT NULL,
  is_popular BOOLEAN DEFAULT FALSE,
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add pricing_tier_id to tenants table
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS pricing_tier_id VARCHAR(50) REFERENCES pricing_tiers(id);

-- Insert default pricing tiers
INSERT INTO pricing_tiers (id, name, description, monthly_price, annual_price, features, is_popular)
VALUES
  ('basic', 'Basic', 'Essential care management features for small agencies', 99, 990, 
   ARRAY['patient_management', 'care_professional_management', 'basic_scheduling', 'basic_reporting', 'document_management'], 
   FALSE),
  ('standard', 'Standard', 'Advanced features for growing care providers', 199, 1990, 
   ARRAY['patient_management', 'care_professional_management', 'advanced_scheduling', 'basic_reporting', 'document_management', 'medication_management', 'care_plan_management', 'basic_invoicing', 'timesheet_management'], 
   TRUE),
  ('premium', 'Premium', 'Comprehensive solution for established care organizations', 349, 3490, 
   ARRAY['patient_management', 'care_professional_management', 'advanced_scheduling', 'advanced_reporting', 'document_management', 'medication_management', 'care_plan_management', 'advanced_invoicing', 'timesheet_management', 'gp_connect', 'risk_assessment', 'audit_trail', 'custom_forms'], 
   FALSE),
  ('enterprise', 'Enterprise', 'Tailored solutions for large healthcare providers', 599, 5990, 
   ARRAY['patient_management', 'care_professional_management', 'advanced_scheduling', 'advanced_reporting', 'document_management', 'medication_management', 'care_plan_management', 'advanced_invoicing', 'timesheet_management', 'gp_connect', 'risk_assessment', 'audit_trail', 'custom_forms', 'api_access', 'white_labeling', 'dedicated_support', 'multi_location'], 
   FALSE),
  ('custom', 'Custom', 'Bespoke solution tailored to your specific requirements', 0, 0, 
   ARRAY[]::TEXT[], 
   FALSE)
ON CONFLICT (id) DO NOTHING;

-- Update tenants to use basic tier by default if not set
UPDATE tenants SET pricing_tier_id = 'basic' WHERE pricing_tier_id IS NULL;

