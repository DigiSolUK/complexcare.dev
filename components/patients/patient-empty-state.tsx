"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface PatientEmptyStateProps {
  onAddPatient?: () => void
}

export function PatientEmptyState({ onAddPatient }: PatientEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="relative h-40 w-40 mb-6">
        <Image src="/images/empty-states/no-patients.png" alt="No patients found" fill className="object-contain" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No patients found</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        You haven't added any patients yet. Add your first patient to get started with patient management.
      </p>
      <Button onClick={onAddPatient}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Your First Patient
      </Button>
    </div>
  )
}
