"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"

interface WizardNavigationProps {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
  isNextDisabled?: boolean
  isSubmitting?: boolean
  isLastStep?: boolean
}

export function WizardNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  isNextDisabled = false,
  isSubmitting = false,
  isLastStep = false,
}: WizardNavigationProps) {
  return (
    <div className="flex justify-between mt-8">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 0 || isSubmitting}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Previous
      </Button>
      <Button
        type="button"
        onClick={onNext}
        disabled={isNextDisabled || isSubmitting}
        className="flex items-center gap-2"
      >
        {isSubmitting ? (
          "Processing..."
        ) : isLastStep ? (
          <>
            <Check className="h-4 w-4" />
            Complete
          </>
        ) : (
          <>
            Next
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  )
}
