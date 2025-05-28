import type { Metadata } from "next"
import { TelemedicineHub } from "@/components/telemedicine/telemedicine-hub"

export const metadata: Metadata = {
  title: "Telemedicine | ComplexCare CRM",
  description: "Conduct virtual consultations with patients through secure video conferencing",
}

export default function TelemedicinePage() {
  return <TelemedicineHub />
}
