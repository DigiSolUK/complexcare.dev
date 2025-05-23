import { PatientDetailClient } from "./patient-detail-client"

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  return <PatientDetailClient patientId={params.id} />
}
