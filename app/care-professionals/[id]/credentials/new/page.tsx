import type { Metadata } from "next"
import { notFound } from "next/navigation"
import AddCredentialClient from "./add-credential-client"

export const metadata: Metadata = {
  title: "Add Credential | ComplexCare CRM",
  description: "Add a new professional credential",
}

export default function AddCredentialPage({ params }: { params: { id: string } }) {
  if (!params.id) {
    notFound()
  }

  return <AddCredentialClient careProfessionalId={params.id} />
}
