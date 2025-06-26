import type { Metadata } from "next"
import MedicationsPageClient from "./MedicationsPageClient"

export const metadata: Metadata = {
  title: "Medications",
  description: "Manage patient medications and prescriptions",
}

export default function MedicationsPage() {
  return <MedicationsPageClient />
}
