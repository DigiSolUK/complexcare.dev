import { PatientManagement } from "@/components/patients/patient-management"

export default function PatientsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Patient Management</h1>
        <p className="text-muted-foreground">Create and manage patients in the ComplexCare CRM system</p>
      </div>

      <PatientManagement />
    </div>
  )
}
