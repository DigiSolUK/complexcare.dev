"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/user-menu"
import { useTenant } from "@/lib/tenant-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Menu } from "lucide-react"

interface HeaderProps {
  toggleSidebar?: () => void
}

export function Header({ toggleSidebar }: HeaderProps) {
  const { currentTenant, isLoading } = useTenant()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
      <Button variant="outline" size="icon" className="md:hidden" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
      <div className="flex flex-1 items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          {isLoading ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : currentTenant?.branding?.logoUrl ? (
            <img
              src={currentTenant.branding.logoUrl || "/placeholder.svg"}
              alt={currentTenant.name}
              className="h-8 w-8 rounded-full object-contain"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
              {currentTenant?.name.charAt(0) || "C"}
            </div>
          )}
          <span className="text-lg font-semibold">
            {isLoading ? <Skeleton className="h-6 w-32" /> : currentTenant?.name || "ComplexCare CRM"}
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <UserMenu />
      </div>
    </header>
  )
}

export function DashboardHeader(props: HeaderProps) {
  return <Header {...props} />
}
