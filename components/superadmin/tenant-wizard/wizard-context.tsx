"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { TenantWizardState } from "@/types/tenant-wizard"

interface WizardContextType {
  state: TenantWizardState
  updateTenantInfo: (data: Partial<TenantWizardState["tenantInfo"]>) => void
  updateAdminUser: (data: Partial<TenantWizardState["adminUser"]>) => void
  updateSubscription: (data: Partial<TenantWizardState["subscription"]>) => void
  updateFeatures: (data: Partial<TenantWizardState["features"]>) => void
  updateBranding: (data: Partial<TenantWizardState["branding"]>) => void
  isStepValid: (step: number) => boolean
}

const initialState: TenantWizardState = {
  tenantInfo: {
    name: "",
    subdomain: "",
    industry: "",
    size: "",
    contactEmail: "",
    contactPhone: "",
  },
  adminUser: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  subscription: {
    plan: "standard",
    billingCycle: "monthly",
    paymentMethod: "invoice",
  },
  features: {
    patientManagement: true,
    clinicalNotes: true,
    medicationTracking: true,
    appointmentScheduling: true,
    billing: true,
    reporting: true,
    aiFeatures: false,
    apiAccess: false,
  },
  branding: {
    primaryColor: "#4f46e5",
    logoUrl: "",
    companyName: "",
    useTenantName: true,
  },
}

const WizardContext = createContext<WizardContextType | undefined>(undefined)

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TenantWizardState>(initialState)

  const updateTenantInfo = (data: Partial<TenantWizardState["tenantInfo"]>) => {
    setState((prev) => ({
      ...prev,
      tenantInfo: { ...prev.tenantInfo, ...data },
    }))
  }

  const updateAdminUser = (data: Partial<TenantWizardState["adminUser"]>) => {
    setState((prev) => ({
      ...prev,
      adminUser: { ...prev.adminUser, ...data },
    }))
  }

  const updateSubscription = (data: Partial<TenantWizardState["subscription"]>) => {
    setState((prev) => ({
      ...prev,
      subscription: { ...prev.subscription, ...data },
    }))
  }

  const updateFeatures = (data: Partial<TenantWizardState["features"]>) => {
    setState((prev) => ({
      ...prev,
      features: { ...prev.features, ...data },
    }))
  }

  const updateBranding = (data: Partial<TenantWizardState["branding"]>) => {
    setState((prev) => ({
      ...prev,
      branding: { ...prev.branding, ...data },
    }))
  }

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0: // Tenant Info
        return (
          !!state.tenantInfo.name &&
          !!state.tenantInfo.subdomain &&
          !!state.tenantInfo.contactEmail &&
          /^[a-zA-Z0-9-]+$/.test(state.tenantInfo.subdomain) &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.tenantInfo.contactEmail)
        )
      case 1: // Admin User
        return (
          !!state.adminUser.firstName &&
          !!state.adminUser.lastName &&
          !!state.adminUser.email &&
          !!state.adminUser.password &&
          state.adminUser.password === state.adminUser.confirmPassword &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.adminUser.email) &&
          state.adminUser.password.length >= 8
        )
      case 2: // Subscription
        return !!state.subscription.plan && !!state.subscription.billingCycle
      case 3: // Features
        return true // All features are optional
      case 4: // Branding
        return true // Branding is optional
      case 5: // Review
        return true // Review is always valid if we got here
      default:
        return false
    }
  }

  return (
    <WizardContext.Provider
      value={{
        state,
        updateTenantInfo,
        updateAdminUser,
        updateSubscription,
        updateFeatures,
        updateBranding,
        isStepValid,
      }}
    >
      {children}
    </WizardContext.Provider>
  )
}

export function useWizardContext() {
  const context = useContext(WizardContext)
  if (context === undefined) {
    throw new Error("useWizardContext must be used within a WizardProvider")
  }
  return context
}
