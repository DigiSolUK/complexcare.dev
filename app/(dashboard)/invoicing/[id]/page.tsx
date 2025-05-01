import type { Metadata } from "next"
import { InvoiceDetailsClient } from "./invoice-details-client"

export const metadata: Metadata = {
  title: "Invoice Details | ComplexCare CRM",
  description: "View and manage invoice details",
}

export default function InvoiceDetailsPage({ params }: { params: { id: string } }) {
  return <InvoiceDetailsClient invoiceId={params.id} />
}
