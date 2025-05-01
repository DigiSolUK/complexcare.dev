export interface TenantWizardState {
  tenantInfo: {
    name: string
    subdomain: string
    industry: string
    size: string
    contactEmail: string
    contactPhone: string
  }
  adminUser: {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
  }
  subscription: {
    plan: "basic" | "standard" | "premium" | "enterprise"
    billingCycle: "monthly" | "annual"
    paymentMethod: "creditCard" | "directDebit" | "invoice"
  }
  features: {
    patientManagement: boolean
    clinicalNotes: boolean
    medicationTracking: boolean
    appointmentScheduling: boolean
    billing: boolean
    reporting: boolean
    aiFeatures: boolean
    apiAccess: boolean
  }
  branding: {
    primaryColor: string
    logoUrl: string
    companyName: string
    useTenantName: boolean
  }
}

export interface TenantCreationResponse {
  success: boolean
  tenantId?: string
  error?: string
}
