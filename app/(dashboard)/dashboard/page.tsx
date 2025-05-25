// Make sure the imports are correct
import type { Metadata } from "next"
import { DashboardClientPage } from "./DashboardClientPage"

export const metadata: Metadata = {
  title: "Dashboard | ComplexCare CRM",
  description: "Dashboard for ComplexCare CRM",
}

export default function DashboardPage() {
  return <DashboardClientPage />
}
