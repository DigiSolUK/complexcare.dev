import { Suspense } from "react"
import { PatientDetailClient } from "./patient-detail-client"
import { PatientDetailSkeleton } from "@/components/patients/patient-detail-skeleton"

interface PatientDetailPageProps {
  params: {
    id: string
  }
}

export default function PatientDetailPage({ params }: PatientDetailPageProps) {
  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<PatientDetailSkeleton />}>
        <PatientDetailClient patientId={params.id} />
      </Suspense>
    </div>
  )
}
