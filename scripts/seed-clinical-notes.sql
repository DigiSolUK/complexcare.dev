-- Insert default clinical note categories
INSERT INTO clinical_note_categories (tenant_id, name, description, color, icon)
VALUES
  ('00000000-0000-0000-0000-000000000000', 'General', 'General clinical notes', '#3B82F6', 'file-text'),
  ('00000000-0000-0000-0000-000000000000', 'Assessment', 'Patient assessment notes', '#10B981', 'clipboard-check'),
  ('00000000-0000-0000-0000-000000000000', 'Treatment', 'Treatment and care plan notes', '#F59E0B', 'activity'),
  ('00000000-0000-0000-0000-000000000000', 'Medication', 'Medication related notes', '#EF4444', 'pill'),
  ('00000000-0000-0000-0000-000000000000', 'Lab Results', 'Laboratory test results', '#8B5CF6', 'flask'),
  ('00000000-0000-0000-0000-000000000000', 'Consultation', 'Consultation notes', '#EC4899', 'users'),
  ('00000000-0000-0000-0000-000000000000', 'Follow-up', 'Follow-up visit notes', '#6366F1', 'calendar');

-- Insert default clinical note templates
INSERT INTO clinical_note_templates (tenant_id, name, content, category_id, created_by)
SELECT 
  '00000000-0000-0000-0000-000000000000', 
  'Initial Assessment', 
  'Patient presents with the following symptoms:\n\n- \n- \n- \n\nVital signs:\n- BP: \n- HR: \n- RR: \n- Temp: \n- O2 Sat: \n\nAssessment:\n\n\nPlan:\n\n',
  id,
  '00000000-0000-0000-0000-000000000000'
FROM clinical_note_categories
WHERE name = 'Assessment' AND tenant_id = '00000000-0000-0000-0000-000000000000'
LIMIT 1;

INSERT INTO clinical_note_templates (tenant_id, name, content, category_id, created_by)
SELECT 
  '00000000-0000-0000-0000-000000000000', 
  'Medication Review', 
  'Current medications:\n\n- \n- \n- \n\nMedication changes:\n\n- \n\nSide effects reported:\n\n- \n\nAdherence assessment:\n\n\nRecommendations:\n\n',
  id,
  '00000000-0000-0000-0000-000000000000'
FROM clinical_note_categories
WHERE name = 'Medication' AND tenant_id = '00000000-0000-0000-0000-000000000000'
LIMIT 1;

INSERT INTO clinical_note_templates (tenant_id, name, content, category_id, created_by)
SELECT 
  '00000000-0000-0000-0000-000000000000', 
  'Follow-up Visit', 
  'Reason for follow-up:\n\n\nChanges since last visit:\n\n\nCurrent status:\n\n\nAssessment:\n\n\nPlan:\n\n',
  id,
  '00000000-0000-0000-0000-000000000000'
FROM clinical_note_categories
WHERE name = 'Follow-up' AND tenant_id = '00000000-0000-0000-0000-000000000000'
LIMIT 1;

-- Insert sample clinical notes for testing
-- First, get a patient ID and user ID
DO $$
DECLARE
    patient_id UUID;
    user_id UUID;
    category_id UUID;
BEGIN
    -- Get a patient ID
    SELECT id INTO patient_id FROM patients LIMIT 1;
    
    -- Get a user ID
    SELECT id INTO user_id FROM users LIMIT 1;
    
    -- Get a category ID
    SELECT id INTO category_id FROM clinical_note_categories LIMIT 1;
    
    -- Only proceed if we have both IDs
    IF patient_id IS NOT NULL AND user_id IS NOT NULL THEN
        -- Insert sample clinical notes
        INSERT INTO clinical_notes (
            tenant_id,
            patient_id,
            title,
            content,
            category_id,
            created_by,
            is_private,
            is_important,
            tags,
            follow_up_date,
            follow_up_notes
        ) VALUES
        (
            (SELECT id FROM tenants LIMIT 1),
            patient_id,
            'Initial Assessment',
            'Chief Complaint: Patient presents with chronic lower back pain that has worsened over the past 2 weeks.

History of Present Illness: 45-year-old patient with a history of degenerative disc disease reports increased pain after gardening. Pain is described as dull and aching, rated 7/10. Worse with bending and prolonged sitting. Minimal relief with OTC pain medications.

Past Medical History: Hypertension, Type 2 Diabetes, Degenerative Disc Disease L4-L5

Medications: Lisinopril 10mg daily, Metformin 500mg BID, Ibuprofen 400mg PRN

Allergies: Penicillin (rash)

Vital Signs: BP 138/82, HR 76, RR 16, Temp 98.6°F, SpO2 98% on RA

Physical Examination: 
- General: Alert and oriented, in mild distress due to pain
- Back: Tenderness to palpation over lumbar spine, limited range of motion due to pain, negative straight leg raise
- Neurological: Strength 5/5 in all extremities, sensation intact, DTRs 2+ and symmetric

Assessment: Acute exacerbation of chronic low back pain, likely mechanical in nature

Plan:
1. Prescribed cyclobenzaprine 10mg TID for 7 days
2. Increase ibuprofen to 600mg TID with meals for 5 days
3. Advised rest, ice, and heat therapy
4. Referral to physical therapy
5. Follow up in 2 weeks',
            category_id,
            user_id,
            false,
            false,
            ARRAY['back pain', 'assessment'],
            NULL,
            NULL
        ),
        (
            (SELECT id FROM tenants LIMIT 1),
            patient_id,
            'Medication Review',
            'Current Medications:
1. Lisinopril 10mg daily
2. Metformin 500mg BID
3. Ibuprofen 600mg TID
4. Cyclobenzaprine 10mg TID

Adherence: Patient reports taking all medications as prescribed except occasionally missing the evening dose of Metformin.

Side Effects: Reports mild drowsiness with cyclobenzaprine, primarily in the morning. No other side effects reported.

Effectiveness: Back pain has improved to 4/10. Blood pressure and blood glucose remain well-controlled.

Changes Made:
1. Decreased cyclobenzaprine to 5mg TID to reduce drowsiness
2. Continued other medications at current doses
3. Discussed strategies to improve adherence with evening Metformin dose

Next Review Date: 3 months',
            (SELECT id FROM clinical_note_categories WHERE name = 'Medication' LIMIT 1),
            user_id,
            false,
            false,
            ARRAY['medication', 'review'],
            CURRENT_DATE + INTERVAL '3 months',
            'Complete comprehensive medication review and assess need for continued muscle relaxants.'
        ),
        (
            (SELECT id FROM tenants LIMIT 1),
            patient_id,
            'Physical Therapy Evaluation',
            'Subjective: Patient reports gradual improvement in back pain following initial assessment. Current pain level 4/10, down from 7/10. Has been compliant with medication regimen and home exercises.

Objective:
- Range of Motion: Forward flexion limited to 60° (improved from 45°), extension to 15° (improved from 10°)
- Strength: Core strength 3+/5, improving from initial assessment
- Palpation: Reduced tenderness over lumbar paraspinal muscles
- Functional Assessment: Able to sit for 30 minutes without significant pain (improved from 15 minutes)

Assessment: Patient showing good progress with conservative management of acute exacerbation of chronic low back pain. Continued improvement in range of motion and function.

Plan:
1. Continue with current medication regimen
2. Progressed home exercise program with focus on core strengthening
3. Instructed in proper body mechanics for daily activities
4. Scheduled for 2 more PT sessions
5. Follow up with primary provider in 1 week',
            (SELECT id FROM clinical_note_categories WHERE name = 'Treatment' LIMIT 1),
            user_id,
            false,
            false,
            ARRAY['physical therapy', 'back pain'],
            CURRENT_DATE + INTERVAL '1 week',
            'Review progress with physical therapy and adjust treatment plan as needed.'
        ),
        (
            (SELECT id FROM tenants LIMIT 1),
            patient_id,
            'Urgent Care Visit - Acute Bronchitis',
            'Chief Complaint: Productive cough, fever, and chest discomfort for 3 days.

History of Present Illness: Patient developed symptoms following exposure to sick family member. Reports yellow-green sputum, fever up to 101.2°F, and chest tightness. No shortness of breath at rest.

Vital Signs: Temp 100.8°F, HR 92, RR 18, BP 142/88, SpO2 96% on RA

Physical Exam:
- General: Mild distress, frequent coughing
- HEENT: Mild pharyngeal erythema, no exudate
- Respiratory: Scattered rhonchi bilaterally, no wheezes or rales
- Cardiovascular: Regular rate and rhythm, no murmurs
- Remainder of exam unremarkable

Assessment: Acute bronchitis, likely viral in etiology

Plan:
1. Symptomatic treatment with guaifenesin and dextromethorphan
2. Increase fluid intake
3. Rest for 2-3 days
4. Return if symptoms worsen or develop shortness of breath
5. Follow up with primary care in 1 week if not improved',
            (SELECT id FROM clinical_note_categories WHERE name = 'Urgent' LIMIT 1),
            user_id,
            false,
            true,
            ARRAY['respiratory', 'urgent', 'infection'],
            CURRENT_DATE + INTERVAL '1 week',
            'Check resolution of symptoms and need for further treatment.'
        );
        
        RAISE NOTICE 'Sample clinical notes inserted successfully';
    ELSE
        RAISE NOTICE 'Could not find patient or user IDs for sample data';
    END IF;
END $$;
