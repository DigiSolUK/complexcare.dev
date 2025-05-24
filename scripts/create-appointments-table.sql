-- Create appointments table if it doesn't exist
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  provider_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
  type VARCHAR(50) NOT NULL,
  notes TEXT,
  location VARCHAR(255),
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern VARCHAR(50),
  recurrence_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT fk_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_patient FOREIGN KEY (patient_id) REFERENCES patients(id),
  CONSTRAINT fk_provider FOREIGN KEY (provider_id) REFERENCES users(id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_appointments_tenant_id ON appointments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_provider_id ON appointments(provider_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Add sample data if needed
INSERT INTO appointments (
  tenant_id, 
  patient_id, 
  provider_id, 
  title, 
  start_time, 
  end_time, 
  status, 
  type, 
  notes, 
  location
)
SELECT
  t.id AS tenant_id,
  p.id AS patient_id,
  u.id AS provider_id,
  'Initial Assessment' AS title,
  NOW() + (RANDOM() * INTERVAL '30 days') AS start_time,
  NOW() + (RANDOM() * INTERVAL '30 days' + INTERVAL '1 hour') AS end_time,
  (ARRAY['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'])[floor(random() * 5 + 1)] AS status,
  (ARRAY['initial_assessment', 'follow_up', 'therapy', 'medication_review', 'care_plan_review'])[floor(random() * 5 + 1)] AS type,
  'Sample appointment notes' AS notes,
  'Main Clinic' AS location
FROM
  tenants t
CROSS JOIN (
  SELECT id FROM patients LIMIT 10
) p
CROSS JOIN (
  SELECT id FROM users WHERE role IN ('doctor', 'nurse', 'therapist', 'admin') LIMIT 5
) u
WHERE
  t.id = '00000000-0000-0000-0000-000000000000' -- Replace with your DEFAULT_TENANT_ID
LIMIT 50;
