CREATE TABLE IF NOT EXISTS patient_vitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    heart_rate INTEGER,
    temperature NUMERIC(5, 2), -- e.g., 37.50
    respiratory_rate INTEGER,
    oxygen_saturation INTEGER, -- Percentage, e.g., 98
    weight NUMERIC(6, 2), -- e.g., 75.50 kg
    height NUMERIC(5, 2), -- e.g., 170.50 cm
    bmi NUMERIC(5, 2), -- Calculated BMI
    notes TEXT,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_patient_vitals_tenant_id ON patient_vitals(tenant_id);
CREATE INDEX IF NOT EXISTS idx_patient_vitals_patient_id ON patient_vitals(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_vitals_recorded_at ON patient_vitals(recorded_at DESC);

-- Add trigger to update updated_at on each update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_patient_vitals_updated_at ON patient_vitals;
CREATE TRIGGER update_patient_vitals_updated_at
BEFORE UPDATE ON patient_vitals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
