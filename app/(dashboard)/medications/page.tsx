import { MedicationManagement } from "@/components/medications/medication-management"

export default function MedicationsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Medication Management</h1>
        <p className="text-muted-foreground">Manage all medications in the ComplexCare CRM system</p>
      </div>

      <MedicationManagement />
    </div>
  )
}
