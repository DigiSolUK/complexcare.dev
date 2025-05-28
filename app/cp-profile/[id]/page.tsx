import type { Metadata } from "next"
import CareProfessionalDetailClient from "./care-professional-detail-client"

export const metadata: Metadata = {
  title: "Care Professional Profile | ComplexCare CRM",
  description: "View care professional details and information",
}

interface PageProps {
  params: {
    id: string
  }
}

export default function CareProfessionalProfilePage({ params }: PageProps) {
  return <CareProfessionalDetailClient careProfessionalId={params.id} />
}
