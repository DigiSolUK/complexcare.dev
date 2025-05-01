"use client"
import { cn } from "@/lib/utils"

interface StepIndicatorProps {
  steps: { id: string; title: string }[]
  currentStep: number
  onStepClick?: (step: number) => void
}

export default function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step, index) => (
          <li key={step.id} className="md:flex-1">
            <div
              className={cn(
                "group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4",
                index < currentStep ? "border-primary" : index === currentStep ? "border-primary" : "border-border",
              )}
              onClick={() => onStepClick && onStepClick(index)}
            >
              <span
                className={cn(
                  "text-sm font-medium",
                  index < currentStep
                    ? "text-primary"
                    : index === currentStep
                      ? "text-primary"
                      : "text-muted-foreground",
                )}
              >
                Step {index + 1}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  index <= currentStep ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.title}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
