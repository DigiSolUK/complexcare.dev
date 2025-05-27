"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useTenant } from "@/contexts/tenant-context"

export interface OnboardingStep {
  id: string
  title: string
  description: string
  isCompleted: boolean
  isRequired: boolean
  path: string
}

interface OnboardingContextType {
  steps: OnboardingStep[]
  currentStepId: string | null
  progress: number
  isOnboardingComplete: boolean
  markStepAsCompleted: (stepId: string) => void
  markStepAsIncomplete: (stepId: string) => void
  navigateToStep: (stepId: string) => void
  skipOnboarding: () => void
  resetOnboarding: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { currentTenant, tenantId } = useTenant()
  const router = useRouter()

  // Define the onboarding steps
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: "welcome",
      title: "Welcome",
      description: "Get to know the platform",
      isCompleted: false,
      isRequired: true,
      path: `/onboarding/${tenantId}/welcome`,
    },
    {
      id: "organization",
      title: "Organization Profile",
      description: "Complete your organization details",
      isCompleted: false,
      isRequired: true,
      path: `/onboarding/${tenantId}/organization`,
    },
    {
      id: "users",
      title: "Invite Team Members",
      description: "Add your team to the platform",
      isCompleted: false,
      isRequired: false,
      path: `/onboarding/${tenantId}/users`,
    },
    {
      id: "patients",
      title: "Add Patients",
      description: "Start adding your patients",
      isCompleted: false,
      isRequired: false,
      path: `/onboarding/${tenantId}/patients`,
    },
    {
      id: "care-professionals",
      title: "Add Care Professionals",
      description: "Add your care team",
      isCompleted: false,
      isRequired: false,
      path: `/onboarding/${tenantId}/care-professionals`,
    },
    {
      id: "integrations",
      title: "Set Up Integrations",
      description: "Connect with other systems",
      isCompleted: false,
      isRequired: false,
      path: `/onboarding/${tenantId}/integrations`,
    },
    {
      id: "complete",
      title: "Complete Setup",
      description: "Finalize your onboarding",
      isCompleted: false,
      isRequired: true,
      path: `/onboarding/${tenantId}/complete`,
    },
  ])

  const [currentStepId, setCurrentStepId] = useState<string | null>("welcome")

  // Calculate progress
  const completedSteps = steps.filter((step) => step.isCompleted).length
  const progress = Math.round((completedSteps / steps.length) * 100)

  // Check if onboarding is complete
  const isOnboardingComplete = steps.filter((step) => step.isRequired).every((step) => step.isCompleted)

  // Mark a step as completed
  const markStepAsCompleted = (stepId: string) => {
    setSteps((prevSteps) => prevSteps.map((step) => (step.id === stepId ? { ...step, isCompleted: true } : step)))

    // Find the next incomplete step
    const currentIndex = steps.findIndex((step) => step.id === stepId)
    const nextStep = steps.slice(currentIndex + 1).find((step) => !step.isCompleted)

    if (nextStep) {
      setCurrentStepId(nextStep.id)
      router.push(nextStep.path)
    } else {
      // If all steps are complete, go to the complete step
      const completeStep = steps.find((step) => step.id === "complete")
      if (completeStep) {
        setCurrentStepId("complete")
        router.push(completeStep.path)
      }
    }
  }

  // Mark a step as incomplete
  const markStepAsIncomplete = (stepId: string) => {
    setSteps((prevSteps) => prevSteps.map((step) => (step.id === stepId ? { ...step, isCompleted: false } : step)))
  }

  // Navigate to a specific step
  const navigateToStep = (stepId: string) => {
    const step = steps.find((s) => s.id === stepId)
    if (step) {
      setCurrentStepId(stepId)
      router.push(step.path)
    }
  }

  // Skip onboarding
  const skipOnboarding = () => {
    // Mark all required steps as completed
    setSteps((prevSteps) => prevSteps.map((step) => (step.isRequired ? { ...step, isCompleted: true } : step)))

    // Redirect to dashboard
    router.push("/dashboard")
  }

  // Reset onboarding
  const resetOnboarding = () => {
    setSteps((prevSteps) => prevSteps.map((step) => ({ ...step, isCompleted: false })))
    setCurrentStepId("welcome")
    router.push(steps[0].path)
  }

  // Update paths when tenant ID changes
  useEffect(() => {
    if (tenantId) {
      setSteps((prevSteps) =>
        prevSteps.map((step) => ({
          ...step,
          path: step.path.replace(/\/onboarding\/[^/]+\//, `/onboarding/${tenantId}/`),
        })),
      )
    }
  }, [tenantId])

  // Load onboarding state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && tenantId) {
      const savedState = localStorage.getItem(`onboarding-${tenantId}`)
      if (savedState) {
        try {
          const { steps: savedSteps, currentStepId: savedCurrentStepId } = JSON.parse(savedState)
          setSteps(savedSteps)
          setCurrentStepId(savedCurrentStepId)
        } catch (error) {
          console.error("Error loading onboarding state:", error)
        }
      }
    }
  }, [tenantId])

  // Save onboarding state to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && tenantId) {
      localStorage.setItem(`onboarding-${tenantId}`, JSON.stringify({ steps, currentStepId }))
    }
  }, [steps, currentStepId, tenantId])

  return (
    <OnboardingContext.Provider
      value={{
        steps,
        currentStepId,
        progress,
        isOnboardingComplete,
        markStepAsCompleted,
        markStepAsIncomplete,
        navigateToStep,
        skipOnboarding,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}
