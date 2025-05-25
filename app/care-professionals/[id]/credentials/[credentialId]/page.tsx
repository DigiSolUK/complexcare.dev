import type { Metadata } from "next"
import { notFound } from "next/navigation"
import CredentialDetailClient from "./credential-detail-client"

export const metadata: Metadata = {
  title: "Credential Details | ComplexCare CRM",
  description: "View professional credential details",
}

export default function CredentialDetailPage({ params }: { params: { id: string; credentialId: string } }) {
  if (!params.id || !params.credentialId) {
    notFound()
  }

  return <CredentialDetailClient careProfessionalId={params.id} credentialId={params.credentialId} />
}
