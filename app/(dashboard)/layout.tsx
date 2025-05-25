import type { ReactNode } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TenantProvider } from "@/components/providers/tenant-provider"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <TenantProvider>
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1">
          <Sidebar className="hidden md:block" />
          <main className="flex-1 p-6 pt-4">
            {/* Emergency recovery notice */}
            {typeof window !== "undefined" && window.location.search.includes("safe_mode=1") && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
                <strong>Safe Mode Active:</strong> The system is running with reduced functionality for emergency
                recovery.
              </div>
            )}
            {children}
          </main>
        </div>
      </div>
    </TenantProvider>
  )
}
