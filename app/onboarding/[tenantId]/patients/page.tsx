"use client"

import { useOnboarding } from "@/contexts/onboarding-context"
import { AIDataImport } from "@/components/onboarding/ai-data-import"

export default function PatientsImportPage() {
  const { markStepAsCompleted } = useOnboarding()

  const handleComplete = () => {
    markStepAsCompleted("patients")
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Import Patient Data</h1>
        <p className="text-muted-foreground mt-2">
          Add your existing patients to the system with AI-assisted data mapping
        </p>
      </div>

      <AIDataImport onComplete={handleComplete} />
    </div>
  )
}
