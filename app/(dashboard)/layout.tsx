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
          <main className="flex-1 p-6 pt-4">{children}</main>
        </div>
      </div>
    </TenantProvider>
  )
}
