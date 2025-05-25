import type { Metadata } from "next"
import { PatientList } from "@/components/patients/patient-list"

export const metadata: Metadata = {
  title: "Patient Management | ComplexCare CRM",
  description: "Manage patients in the system",
}

export default function PatientsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Patient Management</h1>
        <p className="text-muted-foreground">Manage your patients, add new patients, and view patient details</p>
      </div>
      <PatientList />
    </div>
  )
}
