CREATE TABLE IF NOT EXISTS tenant_features (
  id SERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  feature_key VARCHAR(255) NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, feature_key)
);

CREATE INDEX IF NOT EXISTS idx_tenant_features_tenant_id ON tenant_features(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_features_feature_key ON tenant_features(feature_key);

