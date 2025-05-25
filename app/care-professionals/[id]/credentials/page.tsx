import type { Metadata } from "next"
import { notFound } from "next/navigation"
import CredentialsListClient from "./credentials-list-client"

export const metadata: Metadata = {
  title: "Professional Credentials | ComplexCare CRM",
  description: "Manage professional credentials and certifications",
}

export default function CredentialsPage({ params }: { params: { id: string } }) {
  if (!params.id) {
    notFound()
  }

  return <CredentialsListClient careProfessionalId={params.id} />
}
