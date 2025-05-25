import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { ErrorBoundary } from "@/components/error-boundary"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar className="hidden w-64 md:block" />
      <main className="flex-1 overflow-y-auto">
        <ErrorBoundary level="section">{children}</ErrorBoundary>
      </main>
    </div>
  )
}
