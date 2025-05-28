-- Create telemedicine_sessions table
CREATE TABLE IF NOT EXISTS telemedicine_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    appointment_id UUID,
    patient_id UUID NOT NULL,
    care_professional_id UUID NOT NULL,
    session_token VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
    scheduled_start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    notes TEXT,
    recording_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create telemedicine_session_participants table
CREATE TABLE IF NOT EXISTS telemedicine_session_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    session_id UUID NOT NULL REFERENCES telemedicine_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    user_type VARCHAR(50) NOT NULL,
    join_time TIMESTAMP WITH TIME ZONE,
    leave_time TIMESTAMP WITH TIME ZONE,
    connection_quality VARCHAR(50),
    device_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_telemedicine_sessions_tenant_id ON telemedicine_sessions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_telemedicine_sessions_patient_id ON telemedicine_sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_telemedicine_sessions_care_professional_id ON telemedicine_sessions(care_professional_id);
CREATE INDEX IF NOT EXISTS idx_telemedicine_sessions_status ON telemedicine_sessions(status);
CREATE INDEX IF NOT EXISTS idx_telemedicine_sessions_scheduled_start_time ON telemedicine_sessions(scheduled_start_time);
CREATE INDEX IF NOT EXISTS idx_telemedicine_session_participants_session_id ON telemedicine_session_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_telemedicine_session_participants_user_id ON telemedicine_session_participants(user_id);
