import type { Metadata } from "next"
import CarePlansClientPage from "./CarePlansClientPage"

export const metadata: Metadata = {
  title: "Care Plans | ComplexCare CRM",
  description: "Manage patient care plans in the ComplexCare CRM system",
}

export default function CarePlansPage() {
  return <CarePlansClientPage />
}
