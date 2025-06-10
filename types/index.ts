import type { UserRole } from "@/lib/auth/permissions"

// Base types
export type User = {
  id: string
  name?: string | null
  email: string
  image?: string | null
  role: UserRole
  tenantId?: string | null
}

export type Tenant = {
  id: string
  name: string
  slug: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  features: string[]
}

export type ApiKey = {
  id: string
  key: string
  name: string
  createdAt: Date
  expiresAt?: Date | null
  tenantId: string
}

export type Credential = {
  id: string
  type: string // e.g., "NMC PIN", "DBS Certificate"
  value: string // The actual credential number/ID
  issueDate?: Date | null
  expiryDate?: Date | null
  verified: boolean
  careProfessionalId: string
  tenantId: string
  createdAt: Date
  updatedAt: Date
}

export type PayrollProvider = {
  id: string
  name: string
  contactEmail?: string | null
  contactPhone?: string | null
  tenantId: string
  createdAt: Date
  updatedAt: Date
}

export type PayrollSubmission = {
  id: string
  payrollProviderId: string
  submissionDate: Date
  periodStart: Date
  periodEnd: Date
  totalAmount: number
  status: "pending" | "submitted" | "paid" | "failed"
  notes?: string | null
  tenantId: string
  createdAt: Date
  updatedAt: Date
}

export type Invoice = {
  id: string
  patientId: string
  invoiceNumber: string
  issueDate: Date
  dueDate: Date
  totalAmount: number
  status: "pending" | "paid" | "overdue" | "cancelled"
  tenantId: string
  createdAt: Date
  updatedAt: Date
  patientName?: string // Optional, for display purposes
}

export type InvoiceItem = {
  id: string
  invoiceId: string
  description: string
  quantity: number
  unitPrice: number
  total: number
  createdAt: Date
  updatedAt: Date
}

export type Patient = {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  gender: "Male" | "Female" | "Other"
  address: string
  phone: string
  email: string
  nhsNumber?: string | null
  tenantId: string
  createdAt: Date
  updatedAt: Date
  fullName: string // Derived property for convenience
}

export type CareProfessional = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  specialty: string
  tenantId: string
  createdAt: Date
  updatedAt: Date
  fullName: string // Derived property for convenience
}

export type ClinicalNote = {
  id: string
  patientId: string
  careProfessionalId: string
  categoryId: string
  templateId?: string | null
  title: string
  content: string
  noteDate: Date
  tenantId: string
  createdAt: Date
  updatedAt: Date
  patientName?: string // Optional, for display
  careProfessionalName?: string // Optional, for display
  categoryName?: string // Optional, for display
}

export type ClinicalNoteCategory = {
  id: string
  name: string
  description?: string | null
  tenantId: string
  createdAt: Date
  updatedAt: Date
}

export type ClinicalNoteTemplate = {
  id: string
  categoryId: string
  name: string
  content: string
  tenantId: string
  createdAt: Date
  updatedAt: Date
  categoryName?: string // Optional, for display
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
  careProfessionalId: string
  startDate: Date
  endDate: Date
  hoursWorked: number
  status: "pending" | "approved" | "rejected"
  notes?: string | null
  tenantId: string
  createdAt: Date
  updatedAt: Date
  careProfessionalName?: string // Optional, for display
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
