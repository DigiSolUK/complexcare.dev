import type { Metadata } from "next"
import { ErrorLogDetailClient } from "./error-log-detail-client"

export const metadata: Metadata = {
  title: "Error Log Details | ComplexCare CRM",
  description: "View detailed information about a system error",
}

export default function ErrorLogDetailPage({ params }: { params: { id: string } }) {
  return <ErrorLogDetailClient id={params.id} />
}
