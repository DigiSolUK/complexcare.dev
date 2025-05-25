"use client"

import Link from "next/link"
import { ResponsiveTenantSwitcher } from "@/components/tenant/responsive-tenant-switcher"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface DashboardHeaderProps {
  toggleSidebar?: () => void
}

export function DashboardHeader({ toggleSidebar }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {toggleSidebar && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl">ComplexCare CRM</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ResponsiveTenantSwitcher />
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  )
}
