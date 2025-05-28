import type { Metadata } from "next"
import CareProfessionalsContent from "./care-professionals-content"

export const metadata: Metadata = {
  title: "Care Professionals | ComplexCare CRM",
  description: "Manage care professionals in your organization",
}

export default function CareProfessionalsPage() {
  return <CareProfessionalsContent />
}
