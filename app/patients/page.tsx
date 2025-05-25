import { Suspense } from "react"
import { PatientManagement } from "@/components/patients/patient-management"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function PatientsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Patients</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <PatientManagement />
      </Suspense>
    </div>
  )
}
