CREATE TABLE IF NOT EXISTS patients (
  id SERIAL PRIMARY KEY,
  tenant_id VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(50) NOT NULL,
  nhs_number VARCHAR(50),
  contact_number VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  primary_condition TEXT,
  primary_care_provider VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_tenant_id ON patients(tenant_id);
CREATE INDEX IF NOT EXISTS idx_patients_nhs_number ON patients(nhs_number);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_patients_deleted_at ON patients(deleted_at);

-- Insert sample data if the table is empty
INSERT INTO patients (
  tenant_id, first_name, last_name, date_of_birth, gender, 
  nhs_number, contact_number, email, address, 
  primary_condition, primary_care_provider, status, notes
)
SELECT
  'default', 'John', 'Doe', '1980-01-01', 'male',
  '1234567890', '07700900000', 'john.doe@example.com', '123 Main St, London',
  'Hypertension', 'Dr. Smith', 'active', 'Regular checkups'
WHERE NOT EXISTS (
  SELECT 1 FROM patients WHERE tenant_id = 'default' AND first_name = 'John' AND last_name = 'Doe'
);

INSERT INTO patients (
  tenant_id, first_name, last_name, date_of_birth, gender, 
  nhs_number, contact_number, email, address, 
  primary_condition, primary_care_provider, status, notes
)
SELECT
  'default', 'Jane', 'Smith', '1985-05-15', 'female',
  '0987654321', '07700900001', 'jane.smith@example.com', '456 High St, Manchester',
  'Diabetes', 'Dr. Johnson', 'active', 'Monthly insulin checks'
WHERE NOT EXISTS (
  SELECT 1 FROM patients WHERE tenant_id = 'default' AND first_name = 'Jane' AND last_name = 'Smith'
);
