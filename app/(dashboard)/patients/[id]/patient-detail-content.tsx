import { getPatient } from "@/lib/actions/patient-actions"
import { PatientDetailClient } from "./patient-detail-client"
import { notFound } from "next/navigation"

interface PatientDetailContentProps {
  patientId: string
}

export async function PatientDetailContent({ patientId }: PatientDetailContentProps) {
  const result = await getPatient(patientId)

  if (!result.success || !result.data) {
    notFound()
  }

  return <PatientDetailClient patientId={patientId} />
}
