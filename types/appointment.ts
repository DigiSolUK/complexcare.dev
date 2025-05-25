export type AppointmentStatus = "scheduled" | "confirmed" | "completed" | "cancelled" | "no-show"

export interface Appointment {
  id: string
  patient_id: string
  patient_name?: string
  provider_id: string
  provider_name?: string
  title: string
  start_time: string
  end_time: string
  status: string
  type: string
  notes?: string
  location?: string
  is_recurring?: boolean
  recurrence_pattern?: string
  recurrence_end_date?: string
  created_at: string
  updated_at: string
  tenant_id: string
}

export interface AppointmentFormData {
  patient_id: string
  provider_id: string
  title: string
  start_time: string
  end_time: string
  status: string
  type: string
  notes?: string
  location?: string
  is_recurring?: boolean
  recurrence_pattern?: string
  recurrence_end_date?: string
}

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  status: AppointmentStatus
  type: string
  patientId: string
  patientName: string
  providerId: string
  providerName: string
  location?: string
  notes?: string
  isRecurring?: boolean
}
