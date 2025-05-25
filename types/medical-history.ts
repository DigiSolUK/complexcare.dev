export type MedicalHistoryCategory =
  | "CONDITION"
  | "SURGERY"
  | "HOSPITALIZATION"
  | "PROCEDURE"
  | "IMMUNIZATION"
  | "FAMILY_HISTORY"
  | "SOCIAL_HISTORY"
  | "OTHER"

export type MedicalHistorySeverity = "MILD" | "MODERATE" | "SEVERE" | "LIFE_THREATENING"

export type MedicalHistoryStatus = "ACTIVE" | "RESOLVED" | "RECURRING" | "IN_REMISSION" | "CHRONIC"

export interface MedicalHistoryEntry {
  id: string
  patientId: string
  category: MedicalHistoryCategory
  title: string
  description?: string
  onsetDate: Date
  endDate?: Date
  status: MedicalHistoryStatus
  severity?: MedicalHistorySeverity
  provider?: string
  location?: string
  notes?: string
  attachments?: string[]
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy?: string
}

export interface MedicalHistoryFilter {
  category?: MedicalHistoryCategory
  status?: MedicalHistoryStatus
  severity?: MedicalHistorySeverity
  startDate?: Date
  endDate?: Date
  searchTerm?: string
}
