-- Create table for storing tenant-specific GP Connect API configurations
CREATE TABLE IF NOT EXISTS tenant_gp_connect_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  api_endpoint VARCHAR(500) NOT NULL,
  client_id VARCHAR(255) NOT NULL,
  client_secret TEXT NOT NULL,
  jwt_private_key TEXT,
  jwt_key_id VARCHAR(255),
  spine_asid VARCHAR(50),
  spine_party_key VARCHAR(50),
  enabled BOOLEAN NOT NULL DEFAULT false,
  last_tested_at TIMESTAMP WITH TIME ZONE,
  last_test_status VARCHAR(50),
  last_test_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by VARCHAR(255) NOT NULL,
  updated_by VARCHAR(255),
  UNIQUE(tenant_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_tenant_gp_connect_config_tenant_id ON tenant_gp_connect_config(tenant_id);

-- Add GP Connect fields to patient_medical_history table
ALTER TABLE patient_medical_history 
ADD COLUMN IF NOT EXISTS gp_connect_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS gp_connect_source VARCHAR(100),
ADD COLUMN IF NOT EXISTS gp_connect_last_updated TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS gp_connect_metadata JSONB,
ADD COLUMN IF NOT EXISTS snomed_code VARCHAR(50),
ADD COLUMN IF NOT EXISTS dm_d_code VARCHAR(50),
ADD COLUMN IF NOT EXISTS dm_d_name VARCHAR(500),
ADD COLUMN IF NOT EXISTS is_from_gp_connect BOOLEAN DEFAULT false;

-- Create table for storing GP Connect sync history
CREATE TABLE IF NOT EXISTS gp_connect_sync_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  sync_type VARCHAR(50) NOT NULL, -- 'full', 'partial', 'medications', 'conditions', etc.
  sync_status VARCHAR(50) NOT NULL, -- 'success', 'partial_success', 'failed'
  records_fetched INTEGER DEFAULT 0,
  records_created INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_by VARCHAR(255) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_gp_connect_sync_history_tenant_id ON gp_connect_sync_history(tenant_id);
CREATE INDEX IF NOT EXISTS idx_gp_connect_sync_history_patient_id ON gp_connect_sync_history(patient_id);
CREATE INDEX IF NOT EXISTS idx_gp_connect_sync_history_started_at ON gp_connect_sync_history(started_at DESC);

-- Create table for dm+d medication cache
CREATE TABLE IF NOT EXISTS dmd_medication_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  code_type VARCHAR(20) NOT NULL, -- 'AMP', 'VMP', 'VTM', 'VMPP', 'AMPP'
  name VARCHAR(500) NOT NULL,
  supplier VARCHAR(255),
  form VARCHAR(255),
  strength VARCHAR(255),
  unit_dose VARCHAR(100),
  snomed_code VARCHAR(50),
  bnf_code VARCHAR(50),
  active BOOLEAN DEFAULT true,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for medication cache
CREATE INDEX IF NOT EXISTS idx_dmd_medication_cache_code ON dmd_medication_cache(code);
CREATE INDEX IF NOT EXISTS idx_dmd_medication_cache_name ON dmd_medication_cache(name);
CREATE INDEX IF NOT EXISTS idx_dmd_medication_cache_snomed_code ON dmd_medication_cache(snomed_code);

-- Create table for patient medication history from GP Connect
CREATE TABLE IF NOT EXISTS patient_gp_connect_medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  medication_statement_id VARCHAR(255) NOT NULL, -- From GP Connect
  medication_name VARCHAR(500) NOT NULL,
  dm_d_code VARCHAR(50),
  snomed_code VARCHAR(50),
  dosage_instruction TEXT,
  status VARCHAR(50) NOT NULL, -- 'active', 'completed', 'entered-in-error', 'intended', 'stopped', 'on-hold'
  start_date DATE,
  end_date DATE,
  prescriber_name VARCHAR(255),
  prescriber_organization VARCHAR(255),
  last_issue_date DATE,
  quantity_value DECIMAL(10, 2),
  quantity_unit VARCHAR(50),
  days_supply INTEGER,
  repeat_allowed BOOLEAN DEFAULT false,
  repeat_number INTEGER,
  max_repeats INTEGER,
  notes TEXT,
  gp_connect_metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  gp_connect_last_synced TIMESTAMP WITH TIME ZONE,
  UNIQUE(tenant_id, patient_id, medication_statement_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_patient_gp_connect_medications_patient_id ON patient_gp_connect_medications(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_gp_connect_medications_tenant_id ON patient_gp_connect_medications(tenant_id);
CREATE INDEX IF NOT EXISTS idx_patient_gp_connect_medications_status ON patient_gp_connect_medications(status);
CREATE INDEX IF NOT EXISTS idx_patient_gp_connect_medications_start_date ON patient_gp_connect_medications(start_date DESC);
