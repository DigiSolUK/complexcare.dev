import type { Metadata } from "next"
import { PatientPortalDashboard } from "@/components/patient-portal/patient-portal-dashboard"

export const metadata: Metadata = {
  title: "Patient Portal Dashboard | ComplexCare CRM",
  description: "Access your health information, appointments, and communicate with your care team",
}

export default function PatientPortalDashboardPage() {
  return <PatientPortalDashboard />
}
