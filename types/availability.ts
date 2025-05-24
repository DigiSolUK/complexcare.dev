export interface ProviderAvailability {
  id: string
  tenant_id: string
  provider_id: string
  day_of_week?: number | null // 0-6 for Monday-Sunday, null for specific dates
  start_time: string
  end_time: string
  is_available: boolean
  recurrence_type: RecurrenceType
  specific_date?: string | null
  created_at: string
  updated_at: string
  deleted_at?: string | null
  notes?: string | null
  availability_type: AvailabilityType
}

export type RecurrenceType = "weekly" | "biweekly" | "monthly" | "once" | "custom"

export type AvailabilityType = "working_hours" | "break" | "time_off" | "special_hours"

export interface TimeSlot {
  start: Date
  end: Date
  available: boolean
  availabilityId?: string
  notes?: string
}

export interface DayAvailability {
  date: Date
  timeSlots: TimeSlot[]
  isWorkingDay: boolean
}

export interface AvailabilityFormData {
  provider_id: string
  day_of_week?: number | null
  start_time: string
  end_time: string
  is_available: boolean
  recurrence_type: RecurrenceType
  specific_date?: string | null
  notes?: string | null
  availability_type: AvailabilityType
}

export interface TimeOffRequest {
  id: string
  tenant_id: string
  provider_id: string
  start_date: string
  end_date: string
  reason: string
  status: TimeOffStatus
  created_at: string
  updated_at: string
  approved_by?: string | null
  approved_at?: string | null
  notes?: string | null
}

export type TimeOffStatus = "pending" | "approved" | "rejected" | "cancelled"

export interface TimeOffFormData {
  provider_id: string
  start_date: string
  end_date: string
  reason: string
  notes?: string | null
}
