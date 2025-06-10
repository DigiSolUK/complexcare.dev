import { MedicationManagement } from "@/components/medications/medication-management"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

interface PatientMedicationsPageProps {
  params: {
    id: string
  }
}

export default function PatientMedicationsPage({ params }: PatientMedicationsPageProps) {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/patients/${params.id}`}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Patient
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Patient Medications</h1>
        <p className="text-muted-foreground">Manage medications for this patient</p>
      </div>

      <MedicationManagement patientId={params.id} />
    </div>
  )
}
