import type { Metadata } from "next"
import IntegrationsClient from "./integrations-client"

export const metadata: Metadata = {
  title: "Integrations Settings",
  description: "Configure external integrations for your ComplexCare account",
}

export default function IntegrationsPage() {
  return <IntegrationsClient />
}
