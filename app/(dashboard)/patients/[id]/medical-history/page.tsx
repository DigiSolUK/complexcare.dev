import { Suspense } from "react"
import { ComprehensiveMedicalHistory } from "@/components/patients/comprehensive-medical-history"

interface MedicalHistoryPageProps {
  params: {
    id: string
  }
}

export default function MedicalHistoryPage({ params }: MedicalHistoryPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Medical History</h1>
        <p className="text-muted-foreground">View and manage the patient's comprehensive medical history</p>
      </div>

      <Suspense fallback={<div>Loading medical history...</div>}>
        <ComprehensiveMedicalHistory patientId={params.id} tenantId="system" />
      </Suspense>
    </div>
  )
}
