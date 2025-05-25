-- Create error logs table for tracking application errors
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  level VARCHAR(20) DEFAULT 'error',
  component VARCHAR(100),
  route VARCHAR(255),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  stack TEXT,
  details JSONB
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp ON error_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_error_logs_level ON error_logs(level);
CREATE INDEX IF NOT EXISTS idx_error_logs_component ON error_logs(component);
CREATE INDEX IF NOT EXISTS idx_error_logs_route ON error_logs(route);

-- Create view for recent errors
CREATE OR REPLACE VIEW recent_errors AS
SELECT * FROM error_logs
WHERE timestamp > NOW() - INTERVAL '24 hours'
ORDER BY timestamp DESC;

-- Create view for error summary
CREATE OR REPLACE VIEW error_summary AS
SELECT 
  level,
  COUNT(*) as count,
  MIN(timestamp) as first_seen,
  MAX(timestamp) as last_seen
FROM error_logs
GROUP BY level;

-- Create function to clean up old error logs
CREATE OR REPLACE FUNCTION cleanup_old_error_logs(days_to_keep INTEGER)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM error_logs
  WHERE timestamp < NOW() - (days_to_keep || ' days')::INTERVAL
  RETURNING COUNT(*) INTO deleted_count;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to get error trends
CREATE OR REPLACE FUNCTION get_error_trends(days INTEGER DEFAULT 7)
RETURNS TABLE (
  day DATE,
  error_count BIGINT,
  warning_count BIGINT,
  info_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    date_trunc('day', timestamp)::DATE as day,
    COUNT(*) FILTER (WHERE level = 'error') as error_count,
    COUNT(*) FILTER (WHERE level = 'warning') as warning_count,
    COUNT(*) FILTER (WHERE level = 'info') as info_count
  FROM error_logs
  WHERE timestamp > NOW() - (days || ' days')::INTERVAL
  GROUP BY day
  ORDER BY day;
END;
$$ LANGUAGE plpgsql;
