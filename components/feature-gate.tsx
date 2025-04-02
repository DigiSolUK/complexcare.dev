import type { ReactNode } from "react"
import { useFeatures } from "@/lib/features-context"

interface FeatureGateProps {
  featureKey: string
  children: ReactNode
  fallback?: ReactNode
}

export function FeatureGate({ featureKey, children, fallback = null }: FeatureGateProps) {
  const { isFeatureEnabled, isFeaturesContextAvailable } = useFeatures()

  let isEnabled = true

  if (isFeaturesContextAvailable) {
    isEnabled = isFeatureEnabled(featureKey)
  } else {
    // If context is not available, default to enabled for key features
    const keyFeatures = [
      "patient_management",
      "medication_management",
      "care_plan_management",
      "care_professional_management",
      "basic_scheduling",
      "document_management",
      "basic_reporting",
    ]
    isEnabled = keyFeatures.includes(featureKey)
  }

  if (isEnabled) {
    return <>{children}</>
  }

  return <>{fallback}</>
}

