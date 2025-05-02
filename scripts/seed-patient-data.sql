-- Seed comprehensive patient data
INSERT INTO patients (
  id, 
  tenant_id,
  first_name, 
  last_name, 
  date_of_birth, 
  nhs_number, 
  gender, 
  status,
  address,
  contact,
  medical_information,
  created_at,
  updated_at
)
VALUES
(
  '9da03ce9-b13f-48ca-a98d-d5065d193965',
  '11111111-1111-1111-1111-111111111111',
  'John',
  'Smith',
  '1965-05-14',
  '1234567890',
  'Male',
  'active',
  '{"street": "42 Oak Street", "city": "London", "postcode": "SW1A 1AA", "country": "United Kingdom"}',
  '{"phone": "07700900123", "email": "john.smith@example.com", "emergency_contact_name": "Mary Smith", "emergency_contact_phone": "07700900456", "emergency_contact_relationship": "Spouse"}',
  '{"primary_care_provider": "Dr. Elizabeth Johnson", "primary_care_provider_contact": "020 7946 0321", "primary_condition": "Type 2 diabetes diagnosed in 2010, Hypertension since 2015", "allergies": ["Penicillin", "Shellfish"], "blood_type": "A+", "height": 178, "weight": 82, "bmi": 25.9, "smoking_status": "Former smoker, quit in 2018", "alcohol_consumption": "Occasional"}',
  NOW() - INTERVAL '2 years',
  NOW() - INTERVAL '2 months'
),
(
  'a7c53fd8-8e12-4d2f-b9c6-780b7b9b9e1d',
  '11111111-1111-1111-1111-111111111111',
  'Sarah',
  'Johnson',
  '1978-11-23',
  '2345678901',
  'Female',
  'active',
  '{"street": "15 Maple Avenue", "city": "Manchester", "postcode": "M1 1AE", "country": "United Kingdom"}',
  '{"phone": "07700900234", "email": "sarah.johnson@example.com", "emergency_contact_name": "David Johnson", "emergency_contact_phone": "07700900567", "emergency_contact_relationship": "Husband"}',
  '{"primary_care_provider": "Dr. Michael Chen", "primary_care_provider_contact": "0161 234 5678", "primary_condition": "Rheumatoid arthritis, Asthma", "allergies": ["Aspirin", "Dust mites"], "blood_type": "O-", "height": 165, "weight": 62, "bmi": 22.8, "smoking_status": "Never smoked", "alcohol_consumption": "Rare"}',
  NOW() - INTERVAL '18 months',
  NOW() - INTERVAL '1
