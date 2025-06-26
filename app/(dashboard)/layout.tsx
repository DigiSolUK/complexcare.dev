import type { ReactNode } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  // Removed the DemoBanner from here since it's already in the global layout
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 pt-4">{children}</main>
      </div>
    </div>
  )
}
