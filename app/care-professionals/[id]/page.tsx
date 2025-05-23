import { notFound } from "next/navigation"
import CareProfessionalDetailClient from "./care-professional-detail-client"

export const metadata = {
  title: "Care Professional Details",
  description: "View and manage care professional details",
}

export default async function CareProfessionalDetailPage({ params }: { params: { id: string } }) {
  const { id } = params

  if (!id) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <CareProfessionalDetailClient careProfessionalId={id} />
    </div>
  )
}
