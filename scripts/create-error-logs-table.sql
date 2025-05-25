-- Create error_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  category VARCHAR(30) NOT NULL CHECK (category IN ('authentication', 'database', 'api', 'ui', 'integration', 'validation', 'system')),
  user_id VARCHAR(255),
  session_id VARCHAR(255),
  url TEXT,
  user_agent TEXT,
  metadata JSONB,
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_by VARCHAR(255),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index on tenant_id for faster queries
CREATE INDEX IF NOT EXISTS error_logs_tenant_id_idx ON error_logs(tenant_id);

-- Create index on severity for faster filtering
CREATE INDEX IF NOT EXISTS error_logs_severity_idx ON error_logs(severity);

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS error_logs_category_idx ON error_logs(category);

-- Create index on resolved status for faster filtering
CREATE INDEX IF NOT EXISTS error_logs_resolved_idx ON error_logs(resolved);

-- Create index on created_at for faster sorting and date filtering
CREATE INDEX IF NOT EXISTS error_logs_created_at_idx ON error_logs(created_at);
