import { MobilePatientDetail } from "@/components/mobile/mobile-patient-detail"

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  return <MobilePatientDetail patientId={params.id} />
}
