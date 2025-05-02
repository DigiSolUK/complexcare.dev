-- Seed wearable integration settings for a demo tenant
INSERT INTO wearable_integration_settings 
(tenant_id, provider, is_enabled, api_key, api_secret, additional_settings)
VALUES 
('00000000-0000-0000-0000-000000000001', 'fitbit', true, 'demo_fitbit_api_key', 'demo_fitbit_api_secret', '{"webhook_url": "https://complexcare.dev/api/webhooks/fitbit"}'),
('00000000-0000-0000-0000-000000000001', 'apple_health', false, null, null, null),
('00000000-0000-0000-0000-000000000001', 'google_fit', false, null, null, null),
('00000000-0000-0000-0000-000000000002', 'withings', true, 'demo_withings_api_key', 'demo_withings_api_secret', '{"callback_url": "https://complexcare.dev/api/callbacks/withings"}')
ON CONFLICT (tenant_id, provider) DO NOTHING;

-- Seed some demo wearable devices
INSERT INTO wearable_devices 
(tenant_id, patient_id, device_type, device_id, manufacturer, model, status, last_sync, connection_details)
VALUES 
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'fitness_tracker', 'FB12345678', 'Fitbit', 'Charge 5', 'active', NOW() - INTERVAL '2 hours', '{"oauth_token": "demo_token", "oauth_refresh_token": "demo_refresh_token"}'),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'smart_watch', 'AW98765432', 'Apple', 'Watch Series 7', 'active', NOW() - INTERVAL '1 day', '{}'),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'blood_pressure_monitor', 'OM12345678', 'Omron', 'M7 Intelli IT', 'inactive', NOW() - INTERVAL '5 days', '{}'),
('00000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'glucose_monitor', 'DX98765432', 'Dexcom', 'G6', 'active', NOW() - INTERVAL '30 minutes', '{"api_endpoint": "https://api.dexcom.com/v2/"}')
ON CONFLICT DO NOTHING;

-- Seed some demo wearable readings
INSERT INTO wearable_readings 
(tenant_id, patient_id, device_id, reading_type, reading_value, reading_unit, timestamp, metadata)
VALUES 
-- Heart rate readings for patient 1
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'FB12345678', 'heart_rate', 72, 'bpm', NOW() - INTERVAL '2 hours', '{}'),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'FB12345678', 'heart_rate', 75, 'bpm', NOW() - INTERVAL '3 hours', '{}'),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'FB12345678', 'heart_rate', 68, 'bpm', NOW() - INTERVAL '4 hours', '{}'),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'FB12345678', 'heart_rate', 70, 'bpm', NOW() - INTERVAL '5 hours', '{}'),
-- Steps readings for patient 1
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'FB12345678', 'steps', 8500, 'count', NOW() - INTERVAL '1 day', '{}'),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'FB12345678', 'steps', 10200, 'count', NOW() - INTERVAL '2 days', '{}'),
-- Blood pressure readings for patient 3
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'OM12345678', 'blood_pressure', 120, 'mmHg', NOW() - INTERVAL '5 days', '{"diastolic": 80, "pulse": 72}'),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'OM12345678', 'blood_pressure', 118, 'mmHg', NOW() - INTERVAL '6 days', '{"diastolic": 78, "pulse": 70}'),
-- Glucose readings for patient in tenant 2
('00000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'DX98765432', 'blood_glucose', 5.8, 'mmol/L', NOW() - INTERVAL '30 minutes', '{"meal": "post", "medication": "insulin"}'),
('00000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'DX98765432', 'blood_glucose', 7.2, 'mmol/L', NOW() - INTERVAL '4 hours', '{"meal": "pre", "medication": "none"}')
ON CONFLICT DO NOTHING;

-- Seed Office 365 integration settings
INSERT INTO office365_integration_settings
(tenant_id, is_enabled, client_id, client_secret, tenant_name, redirect_uri, scopes)
VALUES
('00000000-0000-0000-0000-000000000001', true, 'demo_o365_client_id', 'demo_o365_client_secret', 'complexcare.onmicrosoft.com', 'https://complexcare.dev/api/integrations/office365/callback', ARRAY['Mail.Read', 'Mail.Send', 'Calendars.ReadWrite']),
('00000000-0000-0000-0000-000000000002', false, null, null, null, null, null)
ON CONFLICT DO NOTHING;

-- Seed Office 365 user connections
INSERT INTO office365_user_connections
(tenant_id, user_id, office365_email, is_connected, last_sync)
VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'user1@complexcare.onmicrosoft.com', true, NOW() - INTERVAL '1 day'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 'user2@complexcare.onmicrosoft.com', true, NOW() - INTERVAL '2 days')
ON CONFLICT DO NOTHING;

-- Seed Office 365 email sync status
INSERT INTO office365_email_sync
(tenant_id, user_id, last_sync_time, sync_status, emails_synced)
VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', NOW() - INTERVAL '1 day', 'completed', 125),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', NOW() - INTERVAL '2 days', 'completed', 87)
ON CONFLICT DO NOTHING;

-- Seed Office 365 calendar sync status
INSERT INTO office365_calendar_sync
(tenant_id, user_id, last_sync_time, sync_status, events_synced)
VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', NOW() - INTERVAL '1 day', 'completed', 15),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', NOW() - INTERVAL '2 days', 'completed', 8)
ON CONFLICT DO NOTHING;
