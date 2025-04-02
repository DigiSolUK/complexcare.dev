"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Icons } from "@/components/icons"
import { useFeatures } from "@/lib/features-context"
import { useSession } from "next-auth/react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { isFeatureEnabled } = useFeatures()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "admin"

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Dashboard</h2>
          <div className="space-y-1">
            <Button
              variant={pathname === "/dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/dashboard">
                <Icons.dashboard className="mr-2 h-4 w-4" />
                Overview
              </Link>
            </Button>
            <Button
              variant={pathname?.startsWith("/patients") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/patients">
                <Icons.users className="mr-2 h-4 w-4" />
                Patients
              </Link>
            </Button>
            <Button
              variant={pathname?.startsWith("/care-professionals") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/care-professionals">
                <Icons.userCog className="mr-2 h-4 w-4" />
                Care Professionals
              </Link>
            </Button>
            <Button
              variant={pathname?.startsWith("/schedule") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/schedule">
                <Icons.calendar className="mr-2 h-4 w-4" />
                Schedule
              </Link>
            </Button>
            {isFeatureEnabled("timesheet_management") && (
              <Button
                variant={pathname?.startsWith("/timesheets") ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/timesheets">
                  <Icons.clock className="mr-2 h-4 w-4" />
                  Timesheets
                </Link>
              </Button>
            )}
            {isFeatureEnabled("basic_invoicing") && (
              <Button
                variant={pathname?.startsWith("/invoices") ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/invoices">
                  <Icons.receipt className="mr-2 h-4 w-4" />
                  Invoices
                </Link>
              </Button>
            )}
            {isFeatureEnabled("document_management") && (
              <Button
                variant={pathname?.startsWith("/documents") ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/documents">
                  <Icons.fileText className="mr-2 h-4 w-4" />
                  Documents
                </Link>
              </Button>
            )}
            {isFeatureEnabled("basic_reporting") && (
              <Button
                variant={pathname?.startsWith("/reports") ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/reports">
                  <Icons.barChart className="mr-2 h-4 w-4" />
                  Reports
                </Link>
              </Button>
            )}
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Settings</h2>
          <div className="space-y-1">
            <Button variant={pathname === "/settings" ? "secondary" : "ghost"} className="w-full justify-start" asChild>
              <Link href="/settings">
                <Icons.settings className="mr-2 h-4 w-4" />
                General
              </Link>
            </Button>
            <Button
              variant={pathname?.startsWith("/settings/users") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/settings/users">
                <Icons.users className="mr-2 h-4 w-4" />
                Users
              </Link>
            </Button>
            <Button
              variant={pathname?.startsWith("/settings/features") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/settings/features">
                <Icons.toggleLeft className="mr-2 h-4 w-4" />
                Features
              </Link>
            </Button>
            <Button
              variant={pathname?.startsWith("/settings/integrations") ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/settings/integrations">
                <Icons.link className="mr-2 h-4 w-4" />
                Integrations
              </Link>
            </Button>
            {isAdmin && (
              <Button
                variant={pathname?.startsWith("/admin/pricing") ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/admin/pricing">
                  <Icons.creditCard className="mr-2 h-4 w-4" />
                  Pricing
                </Link>
              </Button>
            )}
            {isAdmin && (
              <Button
                variant={pathname?.startsWith("/admin/billing") ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/admin/billing">
                  <Icons.pound className="mr-2 h-4 w-4" />
                  Billing
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Icons.menu className="h-4 w-4" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <ScrollArea className="h-full">
          <Sidebar className="w-full" />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

