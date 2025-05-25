import { Suspense } from "react"
import EnhancedPatientDetail from "./enhanced-patient-detail"
import { PatientDetailSkeleton } from "@/components/patients/patient-detail-skeleton"

interface PatientDetailPageProps {
  params: {
    id: string
  }
}

export const metadata = {
  title: "Patient Details | ComplexCare CRM",
  description: "View and manage comprehensive patient details",
}

export default function PatientDetailPage({ params }: PatientDetailPageProps) {
  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<PatientDetailSkeleton />}>
        <EnhancedPatientDetail patientId={params.id} />
      </Suspense>
    </div>
  )
}
