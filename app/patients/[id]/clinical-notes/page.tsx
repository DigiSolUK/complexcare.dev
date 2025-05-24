import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import PatientClinicalNotesClient from "./patient-clinical-notes-client"
import { getPatientById } from "@/lib/services/patient-service"

export const metadata = {
  title: "Patient Clinical Notes | ComplexCare CRM",
  description: "View and manage clinical notes for a patient",
}

interface PatientClinicalNotesPageProps {
  params: {
    id: string
  }
}

export default async function PatientClinicalNotesPage({ params }: PatientClinicalNotesPageProps) {
  const patient = await getPatientById(params.id)
  const patientName = patient ? `${patient.first_name} ${patient.last_name}` : "Unknown Patient"

  return (
    <div className="container mx-auto py-6 px-4">
      <Suspense fallback={<ClinicalNotesSkeleton />}>
        <PatientClinicalNotesClient patientId={params.id} patientName={patientName} />
      </Suspense>
    </div>
  )
}

function ClinicalNotesSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-12 w-full" />
      <div className="grid gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    </div>
  )
}
