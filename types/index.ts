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

// Existing types (assuming they are correct)
export type User = {
  id: string
  name: string | null
  email: string
  image: string | null
  role: UserRole
  tenantId: string | null
  createdAt: Date
  updatedAt: Date
}

export type Patient = {
  id: string
  tenantId: string
  firstName: string
  lastName: string
  fullName: string // Derived property
  dateOfBirth: Date | null
  gender: "Male" | "Female" | "Other" | null
  address: string | null
  phone: string | null
  email: string | null
  nhsNumber: string | null
  createdAt: Date
  updatedAt: Date
}

export type CareProfessional = {
  id: string
  tenantId: string
  userId: string | null // Link to User table if applicable
  firstName: string
  lastName: string
  fullName: string // Derived property
  email: string
  phone: string | null
  role: string // e.g., "Nurse", "Doctor", "Therapist"
  specialty: string | null
  createdAt: Date
  updatedAt: Date
}

export type Medication = {
  id: string
  tenantId: string
  patientId: string
  name: string
  dosage: string
  frequency: string
  startDate: Date
  endDate: Date | null
  prescribedBy: string | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export type ClinicalNoteCategoryTypeType = {
  id: string
  tenantId: string
  name: string
  description: string | null
  createdAt: Date
  updatedAt: Date
}

export type ClinicalNoteTemplateTypeType = {
  id: string
  tenantId: string
  categoryId: string | null
  categoryName?: string // Derived property
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export type ClinicalNoteTypeType = {
  id: string
  tenantId: string
  patientId: string
  patientName?: string // Derived property
  careProfessionalId: string
  careProfessionalName?: string // Derived property
  categoryId: string | null
  categoryName?: string // Derived property
  templateId: string | null
  title: string
  content: string
  noteDate: Date
  createdAt: Date
  updatedAt: Date
}

export type TaskStatus = "todo" | "in-progress" | "done" | "blocked"

export type Task = {
  id: string
  tenantId: string
  title: string
  description: string | null
  dueDate: Date | null
  priority: "low" | "medium" | "high" | "urgent"
  status: TaskStatus
  assignedToId: string | null
  assignedToName?: string | null // Derived property
  patientId: string | null // Added for patient selection
  patientName?: string | null // Derived property
  createdAt: Date
  updatedAt: Date
}

export type Appointment = {
  id: string
  tenantId: string
  patientId: string
  patientName?: string // Derived property
  careProfessionalId: string
  careProfessionalName?: string // Derived property
  title: string
  description: string | null
  startTime: Date
  endTime: Date
  type: string // e.g., "Consultation", "Follow-up", "Therapy"
  status: "scheduled" | "completed" | "cancelled" | "rescheduled"
  location: string | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export type ErrorLog = {
  id: string
  tenantId: string | null
  userId: string | null
  level: "info" | "warn" | "error" | "critical"
  message: string
  stackTrace: string | null
  timestamp: Date
  metadata: Record<string, any> | null
  resolved: boolean
  resolvedAt: Date | null
  resolvedBy: string | null
}

export type WearableDevice = {
  id: string
  tenantId: string
  patientId: string
  deviceName: string
  deviceType: string
  deviceId: string // Unique ID from the wearable system
  connectionStatus: "connected" | "disconnected" | "pending"
  lastSyncAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export type WearableReading = {
  id: string
  tenantId: string
  patientId: string
  deviceId: string
  dataType: string // e.g., "heart_rate", "blood_pressure", "steps"
  value: number
  unit: string | null
  timestamp: Date
  createdAt: Date
}

export type WearableIntegrationSettings = {
  id: string
  tenantId: string
  integrationName: string // e.g., "Fitbit", "Apple Health"
  apiKey: string | null
  apiSecret: string | null
  enabled: boolean
  lastSync: Date | null
  createdAt: Date
  updatedAt: Date
}

export type Office365IntegrationSettings = {
  id: string
  tenantId: string
  clientId: string
  clientSecret: string
  tenantIdO365: string // The Azure AD tenant ID
  redirectUri: string
  enabled: boolean
  createdAt: Date
  updatedAt: Date
}

export type Office365UserConnection = {
  id: string
  tenantId: string
  userId: string // Our internal user ID
  o365UserId: string // Office 365 user ID
  accessToken: string
  refreshToken: string
  expiresIn: number
  scope: string
  connectedAt: Date
  lastRefreshedAt: Date
}

export type Office365EmailSync = {
  id: string
  tenantId: string
  userConnectionId: string
  messageId: string // Office 365 message ID
  subject: string
  sender: string
  receivedDateTime: Date
  bodyPreview: string
  isRead: boolean
  createdAt: Date
}

export type Office365CalendarSync = {
  id: string
  tenantId: string
  userConnectionId: string
  eventId: string // Office 365 event ID
  subject: string
  start: Date
  end: Date
  location: string | null
  isOnlineMeeting: boolean
  organizer: string
  createdAt: Date
}

export type ProviderAvailability = {
  id: string
  tenantId: string
  careProfessionalId: string
  date: Date
  startTime: string // e.g., "09:00"
  endTime: string // e.g., "17:00"
  isAvailable: boolean
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export type TimeOffRequest = {
  id: string
  tenantId: string
  careProfessionalId: string
  startDate: Date
  endDate: Date
  reason: string
  status: "pending" | "approved" | "rejected"
  createdAt: Date
  updatedAt: Date
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

// Clinical Notes Module Types
export interface ClinicalNoteType {
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

export interface ClinicalNoteCategoryType {
  id: string
  tenantId: string
  name: string
  description?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ClinicalNoteTemplateType {
  id: string
  tenantId: string
  categoryId: string
  name: string
  content: string
  createdAt: Date
  updatedAt: Date
  categoryName?: string // For display
}
