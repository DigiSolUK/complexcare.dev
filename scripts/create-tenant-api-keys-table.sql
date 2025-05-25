-- Create table for tenant API keys
CREATE TABLE IF NOT EXISTS tenant_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  service_name VARCHAR(100) NOT NULL,
  api_key VARCHAR(1024) NOT NULL,
  api_secret VARCHAR(1024),
  api_url VARCHAR(1024),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by VARCHAR(255) NOT NULL,
  updated_by VARCHAR(255),
  UNIQUE(tenant_id, service_name)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_tenant_api_keys_tenant_id ON tenant_api_keys(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_api_keys_service_name ON tenant_api_keys(service_name);

-- Insert some example services
INSERT INTO tenant_api_keys (tenant_id, service_name, api_key, api_secret, api_url, created_by)
VALUES 
  ((SELECT id FROM tenants LIMIT 1), 'GP_CONNECT', 'demo-gp-connect-key', 'demo-gp-connect-secret', 'https://api.gp-connect.nhs.uk/v1', 'system'),
  ((SELECT id FROM tenants LIMIT 1), 'DM_AND_D', 'demo-dmd-key', 'demo-dmd-secret', 'https://dmd-browser.nhsbsa.nhs.uk', 'system')
ON CONFLICT (tenant_id, service_name) DO NOTHING;
