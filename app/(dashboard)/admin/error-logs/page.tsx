import type { Metadata } from "next"
import { ErrorLogsClient } from "./error-logs-client"

export const metadata: Metadata = {
  title: "Error Logs | ComplexCare CRM",
  description: "View and manage system error logs",
}

export default function ErrorLogsPage() {
  return <ErrorLogsClient />
}
