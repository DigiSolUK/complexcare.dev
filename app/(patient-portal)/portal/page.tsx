import { PatientPortalDashboard } from "@/components/patient-portal/dashboard"

export const metadata = {
  title: "Patient Portal - Dashboard",
  description: "Access your health information and manage appointments",
}

export default function PatientPortalPage() {
  return (
    <div className="container mx-auto py-6">
      <PatientPortalDashboard />
    </div>
  )
}
