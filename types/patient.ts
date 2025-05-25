export interface PatientAddress {
  id: string
  line1: string
  line2?: string
  city: string
  county: string
  postcode: string
  isMain: boolean
  patientId: string
  createdAt: Date
  updatedAt: Date
}

export interface PatientContact {
  id: string
  type: "PHONE" | "EMAIL" | "MOBILE" | "OTHER"
  value: string
  isPrimary: boolean
  patientId: string
  createdAt: Date
  updatedAt: Date
}

export interface PatientEmergencyContact {
  id: string
  name: string
  relationship: string
  phone: string
  email?: string
  isMainContact: boolean
  patientId: string
  createdAt: Date
  updatedAt: Date
}

export interface PatientAllergy {
  id: string
  allergen: string
  reaction: string
  severity: "MILD" | "MODERATE" | "SEVERE" | "LIFE_THREATENING"
  diagnosedDate: Date
  notes?: string
  isActive: boolean
  patientId: string
  createdAt: Date
  updatedAt: Date
}

export interface MedicalHistoryItem {
  id: string
  condition: string
  diagnosedDate: Date
  resolvedDate?: Date
  notes?: string
  isActive: boolean
  patientId: string
  createdAt: Date
  updatedAt: Date
}

export interface PatientDocument {
  id: string
  title: string
  description?: string
  fileUrl: string
  fileType: string
  fileSize: number
  category: string
  uploadedBy: string
  patientId: string
  createdAt: Date
  updatedAt: Date
}

export interface RiskAssessment {
  id: string
  assessmentDate: Date
  assessedBy: string
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  factors: string[]
  notes?: string
  nextReviewDate: Date
  patientId: string
  createdAt: Date
  updatedAt: Date
}

export interface Patient {
  id: string
  nhsNumber: string
  title?: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY"
  ethnicity?: string
  preferredLanguage?: string
  requiresInterpreter: boolean
  maritalStatus?: string
  occupation?: string
  gpName?: string
  gpSurgery?: string
  gpPhone?: string
  referralSource?: string
  referralDate?: Date
  careStartDate?: Date
  careEndDate?: Date
  status: "ACTIVE" | "INACTIVE" | "DISCHARGED" | "DECEASED"
  notes?: string
  tenantId: string
  createdAt: Date
  updatedAt: Date

  // Related data
  addresses?: PatientAddress[]
  contacts?: PatientContact[]
  emergencyContacts?: PatientEmergencyContact[]
  allergies?: PatientAllergy[]
  medicalHistory?: MedicalHistoryItem[]
  documents?: PatientDocument[]
  riskAssessments?: RiskAssessment[]
}
