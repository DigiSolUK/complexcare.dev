-- Create care plan templates table
CREATE TABLE IF NOT EXISTS care_plan_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  condition VARCHAR(255) NOT NULL,
  goals TEXT[] DEFAULT '{}',
  interventions TEXT[] DEFAULT '{}',
  assessments TEXT[] DEFAULT '{}',
  duration_days INTEGER DEFAULT 90,
  review_frequency_days INTEGER DEFAULT 30,
  created_by UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add template_id to care_plans table
ALTER TABLE care_plans ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES care_plan_templates(id);

-- Create indexes
CREATE INDEX idx_templates_tenant ON care_plan_templates(tenant_id);
CREATE INDEX idx_templates_category ON care_plan_templates(category);
CREATE INDEX idx_templates_active ON care_plan_templates(is_active);
