-- Create error_logs table for tracking application errors
CREATE TABLE IF NOT EXISTS error_logs (
 id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL, -- Optional, if error is tenant-specific
 user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Optional, if error is user-specific
 message TEXT NOT NULL,
 stack TEXT,
 component_path VARCHAR(500),
 component_stack TEXT,
 severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
 status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'investigating', 'resolved')),
 browser_info JSONB,
 url TEXT,
 method VARCHAR(10),
 level VARCHAR(20),
 occurrence_count INTEGER DEFAULT 1,
 created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Standardized column name
 updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Standardized column name
 resolved_at TIMESTAMP WITH TIME ZONE,
 resolved_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_error_logs_tenant_id ON error_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_error_logs_status ON error_logs(status);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON error_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_error_logs_component_path ON error_logs(component_path);

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
