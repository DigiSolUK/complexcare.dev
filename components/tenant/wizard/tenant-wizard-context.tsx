"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface TenantWizardData {
  // Step 1: Basic Information
  basicInfo: {
    name: string
    subdomain: string
    industry: string
    size: string
    description: string
  }
  // Step 2: Contact Information
  contactInfo: {
    primaryContactName: string
    primaryContactEmail: string
    primaryContactPhone: string
    billingEmail: string
    supportEmail: string
    address: {
      street: string
      city: string
      state: string
      postalCode: string
      country: string
    }
  }
  // Step 3: Subscription Plan
  subscription: {
    plan: "starter" | "professional" | "enterprise" | "custom"
    billingCycle: "monthly" | "annual"
    paymentMethod: "card" | "invoice" | "direct_debit"
    startDate: string
    customFeatures?: string[]
  }
  // Step 4: Features & Modules
  features: {
    core: {
      patientManagement: boolean
      appointmentScheduling: boolean
      clinicalNotes: boolean
      medicationTracking: boolean
    }
    advanced: {
      aiAssistant: boolean
      advancedReporting: boolean
      apiAccess: boolean
      customIntegrations: boolean
    }
    compliance: {
      auditLogs: boolean
      dataEncryption: boolean
      roleBasedAccess: boolean
      twoFactorAuth: boolean
    }
  }
  // Step 5: Admin User
  adminUser: {
    firstName: string
    lastName: string
    email: string
    phone: string
    role: string
    sendWelcomeEmail: boolean
  }
}

interface TenantWizardContextType {
  data: TenantWizardData
  currentStep: number
  setCurrentStep: (step: number) => void
  updateData: <K extends keyof TenantWizardData>(section: K, updates: Partial<TenantWizardData[K]>) => void
  canProceed: (step: number) => boolean
  isSubmitting: boolean
  setIsSubmitting: (value: boolean) => void
}

const initialData: TenantWizardData = {
  basicInfo: {
    name: "",
    subdomain: "",
    industry: "",
    size: "",
    description: "",
  },
  contactInfo: {
    primaryContactName: "",
    primaryContactEmail: "",
    primaryContactPhone: "",
    billingEmail: "",
    supportEmail: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "UK",
    },
  },
  subscription: {
    plan: "professional",
    billingCycle: "monthly",
    paymentMethod: "card",
    startDate: new Date().toISOString().split("T")[0],
  },
  features: {
    core: {
      patientManagement: true,
      appointmentScheduling: true,
      clinicalNotes: true,
      medicationTracking: true,
    },
    advanced: {
      aiAssistant: false,
      advancedReporting: false,
      apiAccess: false,
      customIntegrations: false,
    },
    compliance: {
      auditLogs: true,
      dataEncryption: true,
      roleBasedAccess: true,
      twoFactorAuth: false,
    },
  },
  adminUser: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "admin",
    sendWelcomeEmail: true,
  },
}

const TenantWizardContext = createContext<TenantWizardContextType | undefined>(undefined)

export function TenantWizardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<TenantWizardData>(initialData)
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateData = <K extends keyof TenantWizardData>(section: K, updates: Partial<TenantWizardData[K]>) => {
    setData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates,
      },
    }))
  }

  const canProceed = (step: number): boolean => {
    switch (step) {
      case 0: // Basic Info
        return !!(data.basicInfo.name && data.basicInfo.subdomain && data.basicInfo.industry && data.basicInfo.size)
      case 1: // Contact Info
        return !!(
          data.contactInfo.primaryContactName &&
          data.contactInfo.primaryContactEmail &&
          data.contactInfo.billingEmail
        )
      case 2: // Subscription
        return !!(data.subscription.plan && data.subscription.billingCycle)
      case 3: // Features
        return true // All features are optional
      case 4: // Admin User
        return !!(data.adminUser.firstName && data.adminUser.lastName && data.adminUser.email)
      case 5: // Review
        return true
      default:
        return false
    }
  }

  return (
    <TenantWizardContext.Provider
      value={{
        data,
        currentStep,
        setCurrentStep,
        updateData,
        canProceed,
        isSubmitting,
        setIsSubmitting,
      }}
    >
      {children}
    </TenantWizardContext.Provider>
  )
}

export function useTenantWizard() {
  const context = useContext(TenantWizardContext)
  if (!context) {
    throw new Error("useTenantWizard must be used within TenantWizardProvider")
  }
  return context
}
