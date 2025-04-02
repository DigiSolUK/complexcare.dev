import type { Metadata } from "next"
import InvoicingClient from "./invoicing-client"

export const metadata: Metadata = {
  title: "Invoicing | ComplexCare CRM",
  description: "Manage invoices and billing for your clients",
}

export default function InvoicingPage() {
  return <InvoicingClient />
}

