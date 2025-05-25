import type { Metadata } from "next"
import { notFound } from "next/navigation"
import VerifyCredentialClient from "./verify-credential-client"

export const metadata: Metadata = {
  title: "Verify Credential | ComplexCare CRM",
  description: "Verify professional credential",
}

export default function VerifyCredentialPage({ params }: { params: { id: string; credentialId: string } }) {
  if (!params.id || !params.credentialId) {
    notFound()
  }

  return <VerifyCredentialClient careProfessionalId={params.id} credentialId={params.credentialId} />
}
