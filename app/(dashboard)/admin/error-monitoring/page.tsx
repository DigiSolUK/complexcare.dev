import { ErrorDashboard } from "@/components/admin/error-dashboard"

export const metadata = {
  title: "Error Monitoring",
  description: "Monitor and manage application errors",
}

export default function ErrorMonitoringPage() {
  return (
    <div className="container mx-auto py-6">
      <ErrorDashboard />
    </div>
  )
}
