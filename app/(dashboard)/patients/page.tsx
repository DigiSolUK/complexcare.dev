import { getPatients } from "@/lib/services/patient-service"
import { PatientTable } from "@/components/patients/patient-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function PatientsPage() {
  const patients = await getPatients()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">Manage your patients and their care plans</p>
        </div>
        <Button asChild>
          <Link href="/patients/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Patient
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Patient Directory</h2>
          <p className="text-sm text-muted-foreground">View and manage all your patients</p>
        </div>
        <PatientTable patients={patients} />
      </div>
    </div>
  )
}

