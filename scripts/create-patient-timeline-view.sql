-- Create a view for patient timeline events
CREATE OR REPLACE VIEW patient_timeline_events AS
-- Appointments
SELECT 
  a.id,
  'appointment' as type,
  CONCAT('Appointment with ', cp.first_name, ' ', cp.last_name) as title,
  a.reason as description,
  a.appointment_date as timestamp,
  CONCAT(u.first_name, ' ', u.last_name) as performed_by,
  jsonb_build_object(
    'status', a.status,
    'duration', a.duration,
    'location', a.location
  ) as details,
  CASE 
    WHEN a.status = 'cancelled' THEN 'routine'
    WHEN a.appointment_type = 'emergency' THEN 'critical'
    ELSE 'important'
  END as severity,
  a.patient_id,
  a.tenant_id
FROM appointments a
LEFT JOIN care_professionals cp ON a.care_professional_id = cp.id
LEFT JOIN users u ON a.created_by = u.id

UNION ALL

-- Clinical Notes
SELECT 
  cn.id,
  'note' as type,
  cn.title as title,
  LEFT(cn.content, 200) as description,
  cn.created_at as timestamp,
  CONCAT(u.first_name, ' ', u.last_name) as performed_by,
  jsonb_build_object(
    'category', cnc.name,
    'is_important', cn.is_important
  ) as details,
  CASE 
    WHEN cn.is_important THEN 'important'
    ELSE 'routine'
  END as severity,
  cn.patient_id,
  cn.tenant_id
FROM clinical_notes cn
LEFT JOIN clinical_note_categories cnc ON cn.category_id = cnc.id
LEFT JOIN users u ON cn.created_by = u.id

UNION ALL

-- Medications
SELECT 
  m.id,
  'medication' as type,
  CONCAT('Medication: ', m.name) as title,
  CONCAT(m.dosage, ' - ', m.frequency) as description,
  m.start_date as timestamp,
  m.prescribed_by as performed_by,
  jsonb_build_object(
    'status', m.status,
    'end_date', m.end_date
  ) as details,
  'routine' as severity,
  m.patient_id,
  m.tenant_id
FROM medications m

-- Add more event types as needed
ORDER BY timestamp DESC;
