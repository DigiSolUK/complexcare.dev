export type Tenant = {
  id: string
  name: string
  slug: string
  domain?: string | null
  status: string
  subscription_tier: string
  settings?: any // JSONB
  branding?: any // JSONB
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export type TenantUser = {
  id: string
  tenant_id: string
  user_id: string
  role: string
  is_primary: boolean
  created_at: string
  updated_at: string
  deleted_at?: string | null
  // Joined fields
  email?: string | null
  name?: string | null
}

export type TenantInvitation = {
  id: string
  tenant_id: string
  email: string
  role: string
  token: string
  expires_at: string
  created_at: string
  updated_at: string
  accepted_at?: string | null
}

export type User = {
  id: string
  tenant_id: string
  email: string
  name?: string | null
  role: string
  image?: string | null
  phone?: string | null
  address?: any // JSONB
  city?: string | null
  postcode?: string | null
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export type Patient = {
  id: string
  tenant_id: string
  first_name: string
  last_name: string
  date_of_birth: string // 'YYYY-MM-DD' string
  gender?: string | null
  contact_number?: string | null
  email?: string | null
  address?: any // JSONB
  medical_record_number?: string | null
  primary_care_provider?: string | null
  avatar_url?: string | null
  status?: string
  // New medical history fields
  medical_history?: any // JSONB for general medical history
  allergies?: string[] | null // Array of strings
  chronic_conditions?: string[] | null // Array of strings
  past_surgeries?: string[] | null // Array of strings
  family_medical_history?: any // JSONB for structured family history
  immunizations?: string[] | null // Array of strings
  created_at?: string
  updated_at?: string
  created_by?: string | null
  updated_by?: string | null
}

export interface CareProfessional {
  id: string
  tenant_id: string
  first_name: string
  last_name: string
  title?: string | null
  email: string
  phone?: string | null
  role: string
  specialization?: string | null
  qualification?: string | null
  license_number?: string | null
  employment_status?: string | null
  start_date?: string | null // 'YYYY-MM-DD' string
  is_active: boolean
  status: string
  address?: any // JSONB
  notes?: string | null
  emergency_contact_name?: string | null
  emergency_contact_phone?: string | null
  avatar_url?: string | null
  created_at: string
  updated_at: string
  created_by?: string | null
  updated_by?: string | null
}

export type CarePlan = {
  id: string
  tenant_id: string
  patient_id: string
  title: string
  description?: string | null
  status: string
  start_date: string // 'YYYY-MM-DD' string
  end_date?: string | null // 'YYYY-MM-DD' string
  review_date?: string | null // 'YYYY-MM-DD' string
  assigned_to?: string | null // UUID of care_professional
  created_at: string
  updated_at: string
  created_by: string
  updated_by?: string | null
  // Joined fields for display
  patient_name?: string
  assigned_to_name?: string
}

export type Appointment = {
  id: string
  tenant_id: string
  patient_id: string
  care_professional_id?: string | null // Can be null if not assigned
  appointment_date: string // 'YYYY-MM-DD' string
  appointment_time: string // 'HH:MM:SS' string
  duration_minutes: number
  appointment_type: string
  location?: string | null
  status: string
  notes?: string | null
  created_at: string
  updated_at: string
  created_by: string
  updated_by?: string | null
  // Joined fields for display
  patient_name?: string
  care_professional_name?: string
}

export type Task = {
  id: string
  tenant_id: string
  title: string
  description?: string | null
  status: string
  priority: string
  due_date: string // 'YYYY-MM-DD' string
  assigned_to?: string | null
  created_by: string
  updated_by?: string | null
  related_to_type?: string | null
  related_to_id?: string | null
  created_at: string
  updated_at: string
  completed_at?: string | null
}

export type PatientNote = {
  id: string
  tenant_id: string
  patient_id: string
  care_professional_id: string
  note_date: string // 'YYYY-MM-DD' string
  note_type: string
  content: string
  is_private: boolean
  created_at: string
  updated_at: string
  created_by: string
  updated_by?: string | null
  // Joined fields for display
  care_professional_name?: string
}

export type TenantFeature = {
  id: string
  tenant_id: string
  feature_key: string
  is_enabled: boolean
  config?: any
  created_at: string
  updated_at: string
}

export type TenantSetting = {
  id: string
  tenant_id: string
  key: string
  value: string
  created_at: string
  updated_at: string
}

// Types for timesheets, payroll, and credentials

export interface Timesheet {
  id: string
  tenant_id: string
  user_id: string
  userName?: string
  date: string
  startTime: string
  endTime: string
  breakDurationMinutes: number
  totalHours: number
  status: string
  notes?: string | null
  approvedBy?: string | null
  approverName?: string
  approvedAt?: string | null
  createdAt: string
  updatedAt: string
  userOnly?: boolean
}

export type Payroll = {
  id: string
  tenant_id: string
  user_id: string
  pay_period_start: string
  pay_period_end: string
  basic_hours: number
  overtime_hours: number
  holiday_hours: number
  sick_hours: number
  basic_pay: number
  overtime_pay: number
  holiday_pay: number
  sick_pay: number
  bonus: number
  deductions: number
  total_pay: number
  payment_date?: string | null
  payment_reference?: string | null
  status: "draft" | "processed" | "paid"
  notes?: string | null
  created_at: string
  updated_at: string
  user_name?: string
}

export interface ProfessionalCredential {
  id: string
  tenant_id: string
  user_id: string
  user_name?: string
  credential_type: string
  credential_number: string
  issue_date: string
  expiry_date?: string | null
  verification_status: string
  verified_by?: string | null
  verifier_name?: string
  verification_date?: string | null
  verification_notes?: string | null
  document_url?: string | null
  created_at: string
  updated_at: string
  reminders?: CredentialReminder[]
}

export interface CredentialReminder {
  id: string
  tenant_id: string
  credential_id: string
  reminder_date: string
  reminder_sent: boolean
  sent_at?: string | null
  created_at: string
  updated_at: string
}

// New types for invoicing

export interface Invoice {
  id: string
  tenant_id: string
  patient_id: string
  patient_name?: string
  amount: number
  due_date: string
  paid_date?: string | null
  invoice_number: string
  description?: string | null
  status: string
  created_at: string
  updated_at: string
  items?: InvoiceItem[]
}

export interface InvoiceItem {
  id: string
  tenant_id: string
  invoice_id: string
  description: string
  quantity: number
  unit_price: number
  tax_rate: number
  tax_amount: number
  discount_amount: number
  total_amount: number
  created_at: string
  updated_at: string
}

export interface ApiKey {
  id: string
  tenant_id: string
  name: string
  key: string
  scopes: string[]
  expires_at?: string | null
  last_used_at?: string | null
  created_by: string
  created_by_name?: string
  created_at: string
  updated_at: string
}

export type Medication = {
  id: string
  tenant_id: string
  patient_id: string
  name: string
  dosage: string
  frequency: string
  start_date: string
  end_date?: string | null
  prescribed_by?: string | null
  prescribed_by_name?: string | null
  notes?: string | null
  created_at: string
  updated_at: string
}

export type PatientVital = {
  id: string
  tenant_id: string
  patient_id: string
  recorded_at: string // ISO string or 'YYYY-MM-DDTHH:MM:SSZ'
  blood_pressure_systolic?: number | null
  blood_pressure_diastolic?: number | null
  heart_rate?: number | null
  temperature?: number | null
  respiratory_rate?: number | null
  oxygen_saturation?: number | null
  weight?: number | null
  height?: number | null
  bmi?: number | null
  notes?: string | null
  created_by?: string | null
  updated_by?: string | null
  created_at?: string
  updated_at?: string
  // Joined fields for display
  created_by_name?: string
}
