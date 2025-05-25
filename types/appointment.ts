export interface Appointment {
  id: string
  tenant_id: string
  patient_id: string
  provider_id: string
  title: string
  start_time: string
  end_time: string
  status: AppointmentStatus
  type: AppointmentType
  notes?: string
  location?: string
  created_at: string
  updated_at: string
  deleted_at?: string
  patient_name?: string
  provider_name?: string
  is_recurring?: boolean
  recurrence_pattern?: RecurrencePattern
  recurrence_end_date?: string
}

export type AppointmentStatus = "scheduled" | "confirmed" | "completed" | "cancelled" | "no-show"

export type AppointmentType =
  | "initial_assessment"
  | "follow_up"
  | "therapy"
  | "medication_review"
  | "care_plan_review"
  | "emergency"
  | "other"

export type RecurrencePattern = "daily" | "weekly" | "bi-weekly" | "monthly" | "custom"

export interface AppointmentFormData {
  patient_id: string
  provider_id: string
  title: string
  start_time: string
  end_time: string
  status: AppointmentStatus
  type: AppointmentType
  notes?: string
  location?: string
  is_recurring?: boolean
  recurrence_pattern?: RecurrencePattern
  recurrence_end_date?: string
}

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  status: AppointmentStatus
  type: AppointmentType
  patientId: string
  patientName: string
  providerId: string
  providerName: string
  location?: string
  notes?: string
  isRecurring?: boolean
}
