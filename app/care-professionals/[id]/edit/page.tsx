import type { Metadata } from "next"
import { notFound } from "next/navigation"
import CareProfessionalEditClient from "./care-professional-edit-client"

interface CareProfessionalEditPageProps {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: "Edit Care Professional | ComplexCare CRM",
  description: "Edit care professional details in the ComplexCare CRM system",
}

export default async function CareProfessionalEditPage({ params }: CareProfessionalEditPageProps) {
  const { id } = params

  if (!id) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6">
      <CareProfessionalEditClient id={id} />
    </div>
  )
}
