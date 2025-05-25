import type { Metadata } from "next"
import CareProfessionalDetailContent from "./care-professional-detail-content"

export const metadata: Metadata = {
  title: "Care Professional Details | ComplexCare CRM",
  description: "View and manage care professional details",
}

interface PageProps {
  params: {
    id: string
  }
}

export default function CareProfessionalDetailPage({ params }: PageProps) {
  return <CareProfessionalDetailContent careProfessionalId={params.id} />
}
