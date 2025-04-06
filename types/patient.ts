export interface Patient {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  nhsNumber?: string
  address?: string
  phoneNumber?: string
  email?: string
  emergencyContact?: string
  medicalConditions?: string[]
  medications?: string[]
  allergies?: string[]
  notes?: string
  tenantId: string
  avatarUrl?: string
  status: "active" | "inactive" | "on hold"
  createdAt: string
  updatedAt: string
}

