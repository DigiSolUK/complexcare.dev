import type { UserRole } from "@/lib/auth/permissions"

// Core entity types
export interface Tenant {
  id: string
  name: string
  slug: string
  status: string
  plan: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  settings: TenantSettings
}

export interface TenantSettings {
  theme?: string
  logo_url?: string
  primary_color?: string
  secondary_color?: string
  features?: {
    appointments?: boolean
    billing?: boolean
    messaging?: boolean
    reports?: boolean
  }
  [key: string]: any
}

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: UserRole
  status: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  tenant_memberships?: TenantMembership[]
  name?: string | null // Added for convenience, derived from first_name, last_name
  image?: string | null // Added for convenience
  tenantId?: string | null // Added for convenience
}

export interface TenantMembership {
  user_id: string
  tenant_id: string
  role: string
  is_primary: boolean
  created_at: string
  updated_at: string
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

// Form and validation types
export interface FormErrors {
  [key: string]: string
}

// Dashboard types
export interface DashboardStats {
  patientCount: number
  appointmentsToday: number
  tasksOverdue: number
  recentActivity: ActivityItem[]
}

export interface ActivityItem {
  id: string
  type: string
  description: string
  timestamp: string
  user_id?: string
  user_name?: string
  entity_id?: string
  entity_type?: string
}

export type TenantUser = {
  id: string
  tenant_id: string
  user_id: string
  role: string
  is_primary: boolean
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
  // Joined fields
  email?: string
  name?: string
}

export type TenantInvitation = {
  id: string
  tenant_id: string
  email: string
  role: string
  token: string
  expires_at: Date
  created_at: Date
  updated_at: Date
  accepted_at: Date | null
}

export interface Patient {
  id: string
  tenant_id: string
  first_name: string
  last_name: string
  date_of_birth: string | Date
  gender?: string
  contact_number?: string
  email?: string
  address?: string
  medical_record_number?: string
  primary_care_provider?: string
  created_at: string | Date
  updated_at: string | Date
  avatar_url?: string
  nhs_number?: string
  primary_condition?: string
  notes?: string
  fullName: string // Derived property for convenience
}

export interface CareProfessional {
  id: string
  first_name: string
  last_name: string
  title?: string
  email: string
  phone?: string
  role: string
  specialization?: string
  qualification?: string
  license_number?: string
  employment_status?: string
  start_date?: string | Date
  is_active?: boolean
  status?: string
  tenantId?: string
  tenant_id?: string
  created_at?: string | Date
  updated_at?: string | Date
  createdAt?: Date | string
  updatedAt?: Date | string
  created_by?: string
  updated_by?: string
  address?: string
  notes?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  avatar_url?: string
  fullName: string // Derived property for convenience
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
  review_date: string | null
  assigned_to: string | null
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
  title: string
  description?: string | null
  dueDate?: Date | null
  priority: "low" | "medium" | "high"
  status: "pending" | "in_progress" | "completed" | "overdue"
  assignedToId?: string | null // Care Professional ID
  patientId?: string | null // New: Associate task with a patient
  tenantId: string
  createdAt: Date
  updatedAt: Date
  assignedToName?: string // Optional, for display
  patientName?: string // New: Optional, for display
}

export type Timesheet = {
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
  notes?: string
  approvedBy?: string
  approverName?: string
  approvedAt?: string
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

export type ErrorLog = {
  id: string
  level: "info" | "warn" | "error" | "critical"
  message: string
  stackTrace?: string | null
  timestamp: Date
  userId?: string | null
  tenantId?: string | null
  resolved: boolean
  context?: Record<string, any> | null
}

// Clinical Notes Module Types
export interface ClinicalNote {
  id: string
  tenantId: string
  patientId: string
  careProfessionalId: string
  categoryId: string
  templateId?: string | null
  title: string
  content: string
  noteDate: Date
  createdAt: Date
  updatedAt: Date
  patientName?: string // For display
  careProfessionalName?: string // For display
  categoryName?: string // For display
  templateName?: string // For display
}

export interface ClinicalNoteCategory {
  id: string
  tenantId: string
  name: string
  description?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ClinicalNoteTemplate {
  id: string
  tenantId: string
  categoryId: string
  name: string
  content: string
  createdAt: Date
  updatedAt: Date
  categoryName?: string // For display
}
