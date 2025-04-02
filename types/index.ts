export type Tenant = {
  id: string
  name: string
  subscription_plan: string
  subscription_status: string
  is_active: boolean
  primary_color: string
  secondary_color: string
  logo_url: string | null
  domain: string | null
  slug: string
  created_at: Date
  updated_at: Date
  trial_ends_at: Date | null
}

export type User = {
  id: string
  tenant_id: string
  name: string
  email: string
  role: string
  image: string | null
  phone: string | null
  address: string | null
  city: string | null
  postcode: string | null
  created_at: Date
  updated_at: Date
}

export interface Patient {
  id: string
  tenant_id: string
  first_name: string
  last_name: string
  date_of_birth: string
  gender?: string
  contact_number?: string
  email?: string
  address?: string
  medical_record_number?: string
  primary_care_provider?: string
  created_at: string
  updated_at: string
  avatar_url?: string
}

export interface CareProfessional {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  role: string
  specialization?: string
  qualification?: string
  license_number?: string
  employment_status?: string
  start_date?: string
  is_active?: boolean
  status?: string
  tenantId?: string
  tenant_id?: string
  created_at?: string
  updated_at?: string
  createdAt?: Date | string
  updatedAt?: Date | string
  created_by?: string
  updated_by?: string
  address?: string
  notes?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  avatar_url?: string
}

export type CarePlan = {
  id: string
  tenant_id: string
  patient_id: string
  title: string
  description: string | null
  status: string
  start_date: Date
  end_date: Date | null
  created_at: Date
  updated_at: Date
  created_by: string
  updated_by: string | null
}

export type Appointment = {
  id: string
  tenant_id: string
  patient_id: string
  care_professional_id: string
  appointment_date: Date
  appointment_time: string
  duration_minutes: number
  appointment_type: string
  location: string | null
  status: string
  notes: string | null
  created_at: Date
  updated_at: Date
  created_by: string
  updated_by: string | null
}

export type Task = {
  id: string
  tenant_id: string
  title: string
  description: string | null
  status: string
  priority: string
  due_date: Date
  assigned_to: string | null
  created_by: string
  related_to_type: string | null
  related_to_id: string | null
  created_at: Date
  updated_at: Date
  completed_at: Date | null
}

export type PatientNote = {
  id: string
  tenant_id: string
  patient_id: string
  care_professional_id: string
  note_date: Date
  note_type: string
  content: string
  is_private: boolean
  created_at: Date
  updated_at: Date
  created_by: string
  updated_by: string | null
}

export type TenantFeature = {
  id: string
  tenant_id: string
  feature_key: string
  is_enabled: boolean
  config: any
  created_at: Date
  updated_at: Date
}

export type TenantSetting = {
  id: string
  tenant_id: string
  key: string
  value: string
  created_at: Date
  updated_at: Date
}

// Types for timesheets, payroll, and credentials

export interface Timesheet {
  id: string
  tenant_id: string
  user_id: string
  user_name?: string
  date: string
  start_time: string
  end_time: string
  break_duration_minutes: number
  total_hours: number
  status: string
  notes?: string
  approved_by?: string
  approver_name?: string
  approved_at?: string
  created_at: string
  updated_at: string
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
  payment_date: string | null
  payment_reference: string | null
  status: "draft" | "processed" | "paid"
  notes: string | null
  created_at: Date
  updated_at: Date
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
  expiry_date?: string
  verification_status: string
  verified_by?: string
  verifier_name?: string
  verification_date?: string
  verification_notes?: string
  document_url?: string
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
  sent_at?: string
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
  paid_date?: string
  invoice_number: string
  description?: string
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
  expires_at?: string
  last_used_at?: string
  created_by: string
  created_by_name?: string
  created_at: string
  updated_at: string
}

