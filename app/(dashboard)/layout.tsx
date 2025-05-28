import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { PublicModeBanner } from "@/components/public-mode-banner"

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
          <PublicModeBanner />
          {children}
        </main>
      </div>
    </div>
  )
}
