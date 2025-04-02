"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Define available features with their default states
const AVAILABLE_FEATURES = {
  patient_management: true,
  medication_management: true,
  care_plan_management: true,
  risk_assessment: false,
  care_professional_management: true,
  basic_scheduling: true,
  advanced_scheduling: false,
  document_management: true,
  timesheet_management: false,
  custom_forms: false,
  multi_location: false,
  basic_invoicing: false,
  advanced_invoicing: false,
  basic_reporting: true,
  advanced_reporting: false,
  audit_trail: false,
  gp_connect: false,
  api_access: false,
  white_labeling: false,
  dedicated_support: false,
}

interface FeaturesContextType {
  features: Record<string, boolean>
  isFeatureEnabled: (featureKey: string) => boolean
  isLoading: boolean
}

const FeaturesContext = createContext<FeaturesContextType>({
  features: AVAILABLE_FEATURES,
  isFeatureEnabled: (key) => AVAILABLE_FEATURES[key as keyof typeof AVAILABLE_FEATURES] || false,
  isLoading: false,
})

export function useFeatures() {
  return useContext(FeaturesContext)
}

interface FeaturesProviderProps {
  children: ReactNode
}

export function FeaturesProvider({ children }: FeaturesProviderProps) {
  const [features, setFeatures] = useState<Record<string, boolean>>(AVAILABLE_FEATURES)
  const [isLoading, setIsLoading] = useState(false)

  const isFeatureEnabled = (featureKey: string): boolean => {
    return features[featureKey] === true
  }

  return (
    <FeaturesContext.Provider
      value={{
        features,
        isFeatureEnabled,
        isLoading,
      }}
    >
      {children}
    </FeaturesContext.Provider>
  )
}

