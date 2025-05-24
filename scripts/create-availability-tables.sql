-- Create provider_availability table
CREATE TABLE IF NOT EXISTS provider_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  provider_id UUID NOT NULL,
  day_of_week INTEGER, -- 0-6 for Monday-Sunday, NULL for specific dates
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  recurrence_type VARCHAR(20) NOT NULL, -- weekly, biweekly, monthly, once, custom
  specific_date DATE, -- NULL for recurring availability
  notes TEXT,
  availability_type VARCHAR(20) NOT NULL, -- working_hours, break, time_off, special_hours
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  FOREIGN KEY (provider_id) REFERENCES users(id)
);

-- Create time_off_requests table
CREATE TABLE IF NOT EXISTS time_off_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  provider_id UUID NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, approved, rejected, cancelled
  notes TEXT,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  FOREIGN KEY (provider_id) REFERENCES users(id),
  FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_provider_availability_provider_id ON provider_availability(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_availability_tenant_id ON provider_availability(tenant_id);
CREATE INDEX IF NOT EXISTS idx_provider_availability_day_of_week ON provider_availability(day_of_week);
CREATE INDEX IF NOT EXISTS idx_provider_availability_specific_date ON provider_availability(specific_date);
CREATE INDEX IF NOT EXISTS idx_provider_availability_is_available ON provider_availability(is_available);

CREATE INDEX IF NOT EXISTS idx_time_off_requests_provider_id ON time_off_requests(provider_id);
CREATE INDEX IF NOT EXISTS idx_time_off_requests_tenant_id ON time_off_requests(tenant_id);
CREATE INDEX IF NOT EXISTS idx_time_off_requests_status ON time_off_requests(status);
CREATE INDEX IF NOT EXISTS idx_time_off_requests_date_range ON time_off_requests(start_date, end_date);
