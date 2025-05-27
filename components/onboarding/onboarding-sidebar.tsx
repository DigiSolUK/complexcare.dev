"use client"

import { useOnboarding } from "@/contexts/onboarding-context"
import { useTenant } from "@/contexts/tenant-context"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, HelpCircle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function OnboardingSidebar() {
  const { steps, currentStepId, progress, navigateToStep, skipOnboarding } = useOnboarding()
  const { currentTenant } = useTenant()

  return (
    <div className="w-80 border-r bg-white p-6 flex flex-col h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Welcome to ComplexCare</h1>
        {currentTenant && <p className="text-sm text-muted-foreground mt-1">{currentTenant.name}</p>}
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Setup Progress</span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <nav className="space-y-1 flex-1 overflow-y-auto">
        {steps.map((step) => (
          <Button
            key={step.id}
            variant="ghost"
            className={cn(
              "w-full justify-start px-3 py-2 h-auto",
              currentStepId === step.id && "bg-muted",
              step.isCompleted && "text-primary",
            )}
            onClick={() => navigateToStep(step.id)}
          >
            <div className="flex items-center w-full">
              <div className="mr-3">
                {step.isCompleted ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <Circle className="h-5 w-5" />}
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium">{step.title}</span>
                <span className="text-xs text-muted-foreground">{step.description}</span>
              </div>
            </div>
          </Button>
        ))}
      </nav>

      <div className="pt-6 border-t mt-6 space-y-4">
        <Button variant="outline" className="w-full" onClick={skipOnboarding}>
          Skip Onboarding
        </Button>
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <HelpCircle className="h-4 w-4 mr-2" />
          <Link href="/help" className="hover:underline">
            Need help?
          </Link>
        </div>
      </div>
    </div>
  )
}
