"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// Define the onboarding step type
export interface OnboardingStep {
  id: string
  title: string
  description: string
  isCompleted: boolean
  isRequired: boolean
  path: string
}

// Define the context type
interface OnboardingContextType {
  steps: OnboardingStep[]
  currentStepId: string
  progress: number
  navigateToStep: (stepId: string) => void
  completeStep: (stepId: string) => void
  skipOnboarding: () => void
  isOnboardingComplete: boolean
}

// Create the context with default values
const OnboardingContext = createContext<OnboardingContextType>({
  steps: [],
  currentStepId: "",
  progress: 0,
  navigateToStep: () => {},
  completeStep: () => {},
  skipOnboarding: () => {},
  isOnboardingComplete: false,
})

// Default onboarding steps
const defaultSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome",
    description: "Introduction to ComplexCare",
    isCompleted: false,
    isRequired: true,
    path: "/welcome",
  },
  {
    id: "organization",
    title: "Organization Profile",
    description: "Set up your organization details",
    isCompleted: false,
    isRequired: true,
    path: "/organization",
  },
  {
    id: "users",
    title: "Invite Team Members",
    description: "Add your colleagues",
    isCompleted: false,
    isRequired: true,
    path: "/users",
  },
  {
    id: "patients",
    title: "Add Patients",
    description: "Start building your patient database",
    isCompleted: false,
    isRequired: false,
    path: "/patients",
  },
  {
    id: "professionals",
    title: "Add Care Professionals",
    description: "Set up your care team",
    isCompleted: false,
    isRequired: false,
    path: "/professionals",
  },
  {
    id: "integrations",
    title: "Set Up Integrations",
    description: "Connect with other systems",
    isCompleted: false,
    isRequired: false,
    path: "/integrations",
  },
  {
    id: "complete",
    title: "Complete Setup",
    description: "Finalize your onboarding",
    isCompleted: false,
    isRequired: true,
    path: "/complete",
  },
]

// Provider component
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [steps, setSteps] = useState<OnboardingStep[]>(defaultSteps)
  const [currentStepId, setCurrentStepId] = useState<string>(defaultSteps[0].id)
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(false)

  // Calculate progress
  const progress = Math.round(
    (steps.filter((step) => step.isCompleted).length / steps.filter((step) => step.isRequired).length) * 100,
  )

  // Function to navigate to a step
  const navigateToStep = (stepId: string) => {
    const step = steps.find((s) => s.id === stepId)
    if (step) {
      setCurrentStepId(stepId)
      router.push(`/onboarding/tenant-1${step.path}`)
    }
  }

  // Function to mark a step as completed
  const completeStep = (stepId: string) => {
    setSteps((prevSteps) => prevSteps.map((step) => (step.id === stepId ? { ...step, isCompleted: true } : step)))

    // Find the next incomplete required step
    const currentIndex = steps.findIndex((step) => step.id === stepId)
    const nextStep = steps
      .slice(currentIndex + 1)
      .find((step) => !step.isCompleted && (step.isRequired || step.id === "complete"))

    if (nextStep) {
      navigateToStep(nextStep.id)
    } else {
      // If all required steps are completed, navigate to the completion step
      const completeStep = steps.find((step) => step.id === "complete")
      if (completeStep) {
        navigateToStep("complete")
      }
    }
  }

  // Function to skip onboarding
  const skipOnboarding = () => {
    setIsOnboardingComplete(true)
    router.push("/dashboard")
  }

  // Load saved progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem("onboardingProgress")
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress)
        setSteps(parsedProgress.steps)
        setCurrentStepId(parsedProgress.currentStepId)
        setIsOnboardingComplete(parsedProgress.isOnboardingComplete)
      } catch (error) {
        console.error("Error loading onboarding progress:", error)
      }
    }
  }, [])

  // Save progress to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(
      "onboardingProgress",
      JSON.stringify({
        steps,
        currentStepId,
        isOnboardingComplete,
      }),
    )
  }, [steps, currentStepId, isOnboardingComplete])

  return (
    <OnboardingContext.Provider
      value={{
        steps,
        currentStepId,
        progress,
        navigateToStep,
        completeStep,
        skipOnboarding,
        isOnboardingComplete,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

// Hook to use the onboarding context
export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}
