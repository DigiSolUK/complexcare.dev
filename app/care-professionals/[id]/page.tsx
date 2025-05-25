import type { Metadata } from "next"
import CareProfessionalDetailClient from "./care-professional-detail-client"

export const metadata: Metadata = {
  title: "Care Professional Details | ComplexCare CRM",
  description: "View and manage care professional details",
}

export default function CareProfessionalDetailPage({ params }: { params: { id: string } }) {
  return <CareProfessionalDetailClient careProfessionalId={params.id} />
}
