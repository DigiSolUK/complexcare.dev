import type React from "react"
import { SuperadminHeader } from "@/components/superadmin/superadmin-header"
import { SuperadminSidebar } from "@/components/superadmin/superadmin-sidebar"

interface SuperadminLayoutProps {
  children: React.ReactNode
}

export default function SuperadminLayout({ children }: SuperadminLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SuperadminHeader />
      <div className="flex flex-1 gap-0">
        <aside className="hidden w-64 border-r lg:block">
          <SuperadminSidebar />
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
