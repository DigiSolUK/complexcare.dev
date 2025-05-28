import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">
              <strong>Public Mode:</strong> The system is running in public mode with mock data. All features are
              accessible without authentication.
            </p>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
