import type { Metadata } from "next"
import CareProfessionalDetailClient from "./care-professional-detail-client"

export const metadata: Metadata = {
  title: "Care Professional Details | ComplexCare CRM",
  description: "View care professional details and information",
}

interface PageProps {
  params: {
    id: string
  }
}

export default function CareProfessionalDetailPage({ params }: PageProps) {
  return <CareProfessionalDetailClient careProfessionalId={params.id} />
}
