import ComprehensivePatientDetail from "./comprehensive-patient-detail"

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  return <ComprehensivePatientDetail patientId={params.id} />
}
