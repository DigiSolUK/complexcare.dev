"use client"

import type React from "react"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TenantProvider } from "@/lib/tenant-context" // Ensure TenantProvider is imported

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <TenantProvider>
      {" "}
      {/* Wrap with TenantProvider */}
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-16 items-center border-b px-4 lg:px-6">
              {/* Placeholder for logo/branding in desktop sidebar */}
              <span className="text-lg font-semibold">ComplexCare CRM</span>
            </div>
            <ScrollArea className="flex-1">
              <DashboardSidebar />
            </ScrollArea>
          </div>
        </div>
        <div className="flex flex-col">
          <DashboardHeader toggleSidebar={toggleSidebar} />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">{children}</main>
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="flex flex-col p-0">
            <div className="flex h-16 items-center border-b px-4">
              {/* Placeholder for logo/branding in mobile sidebar */}
              <span className="text-lg font-semibold">ComplexCare CRM</span>
            </div>
            <ScrollArea className="flex-1">
              <DashboardSidebar />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </TenantProvider>
  )
}
