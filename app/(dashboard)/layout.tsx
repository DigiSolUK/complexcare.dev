import type React from "react"
import { useTenant } from "@/contexts/tenant-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { tenant } = useTenant()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-4">
        <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
        <p>Tenant: {tenant?.name || "No Tenant"}</p>
        {/* Add sidebar navigation links here */}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">{children}</div>
    </div>
  )
}
