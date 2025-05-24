-- Add missing foreign key constraints for data integrity
ALTER TABLE clinical_notes 
  ADD CONSTRAINT fk_clinical_notes_patient 
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE;

ALTER TABLE clinical_notes 
  ADD CONSTRAINT fk_clinical_notes_category 
  FOREIGN KEY (category_id) REFERENCES clinical_note_categories(id) ON DELETE SET NULL;

ALTER TABLE clinical_note_attachments
  ADD CONSTRAINT fk_attachments_note
  FOREIGN KEY (note_id) REFERENCES clinical_notes(id) ON DELETE CASCADE;

ALTER TABLE appointments 
  ADD CONSTRAINT fk_appointments_patient 
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE;

ALTER TABLE tasks
  ADD CONSTRAINT fk_tasks_assigned_to
  FOREIGN KEY (assigned_to) REFERENCES care_professionals(id) ON DELETE SET NULL;

ALTER TABLE professional_credentials
  ADD CONSTRAINT fk_credentials_user
  FOREIGN KEY (user_id) REFERENCES care_professionals(id) ON DELETE CASCADE;

-- Add check constraints for data quality
ALTER TABLE appointments ADD CONSTRAINT chk_appointment_times 
  CHECK (end_time > start_time);

ALTER TABLE appointments ADD CONSTRAINT chk_appointment_status 
  CHECK (status IN ('scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'));

ALTER TABLE tasks ADD CONSTRAINT chk_task_priority
  CHECK (priority IN ('low', 'medium', 'high', 'urgent'));

ALTER TABLE tasks ADD CONSTRAINT chk_task_status
  CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled'));
