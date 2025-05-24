import { Suspense } from "react"
import { PatientClinicalNotesClient } from "./patient-clinical-notes-client"
import { Skeleton } from "@/components/ui/skeleton"

interface PatientClinicalNotesPageProps {
  params: {
    id: string
  }
}

export default function PatientClinicalNotesPage({ params }: PatientClinicalNotesPageProps) {
  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <PatientClinicalNotesClient patientId={params.id} />
      </Suspense>
    </div>
  )
}
