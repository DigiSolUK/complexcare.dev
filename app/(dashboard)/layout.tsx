import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { PageErrorBoundary } from "@/components/error-boundaries/page-error-boundary"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PageErrorBoundary>
      <div className="flex min-h-screen flex-col">
        <DashboardLayoutClient>{children}</DashboardLayoutClient>
      </div>
    </PageErrorBoundary>
  )
}
;("use client")

import { useState } from "react"

function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <div className={`${sidebarOpen ? "w-64" : "w-0 -ml-64"} transition-all duration-300 md:ml-0 md:w-64`}>
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto bg-muted/20">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    </>
  )
}
