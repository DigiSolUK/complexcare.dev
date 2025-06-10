-- Create Error Logs table (for application errors)
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

-- Add index for performance on error_logs
CREATE INDEX IF NOT EXISTS idx_error_logs_tenant_id_timestamp ON error_logs(tenant_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity_status ON error_logs(severity, status);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_error_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function
CREATE TRIGGER update_error_logs_updated_at_trigger
BEFORE UPDATE ON error_logs
FOR EACH ROW
EXECUTE FUNCTION update_error_logs_updated_at();

-- Create a function to increment occurrence count for duplicate errors
CREATE OR REPLACE FUNCTION increment_error_occurrence(
  p_tenant_id UUID,
  p_message TEXT,
  p_component_path VARCHAR(500)
)
RETURNS UUID AS $$
DECLARE
  v_error_id UUID;
BEGIN
  -- Try to find an existing error with the same message and component
  SELECT id INTO v_error_id
  FROM error_logs
  WHERE tenant_id = p_tenant_id
    AND message = p_message
    AND component_path = p_component_path
    AND status != 'resolved'
    AND created_at > NOW() - INTERVAL '24 hours'
  LIMIT 1;

  IF v_error_id IS NOT NULL THEN
    -- Increment the occurrence count
    UPDATE error_logs
    SET occurrence_count = occurrence_count + 1,
        updated_at = NOW()
    WHERE id = v_error_id;
  END IF;

  RETURN v_error_id;
END;
$$ LANGUAGE plpgsql;
