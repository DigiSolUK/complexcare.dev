import type { Metadata } from "next"
import { ApiSettingsClient } from "./api-settings-client"

export const metadata: Metadata = {
  title: "API Settings | ComplexCare CRM",
  description: "Manage API integrations and keys for external services",
}

export default function ApiSettingsPage() {
  return <ApiSettingsClient />
}
