"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Users,
  FileText,
  Calendar,
  Settings,
  Home,
  ClipboardList,
  PieChart,
  User,
  CreditCard,
  BarChart,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Sidebar({ className, open, onOpenChange }: SidebarProps) {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Patients",
      icon: Users,
      href: "/patients",
      active: pathname === "/patients" || pathname.startsWith("/patients/"),
    },
    {
      label: "Clinical Notes",
      icon: FileText,
      href: "/clinical-notes",
      active: pathname === "/clinical-notes" || pathname.startsWith("/clinical-notes/"),
    },
    {
      label: "Appointments",
      icon: Calendar,
      href: "/appointments",
      active: pathname === "/appointments" || pathname.startsWith("/appointments/"),
    },
    {
      label: "Tasks",
      icon: ClipboardList,
      href: "/tasks",
      active: pathname === "/tasks" || pathname.startsWith("/tasks/"),
    },
    {
      label: "Analytics",
      icon: BarChart,
      href: "/analytics",
      active: pathname === "/analytics" || pathname.startsWith("/analytics/"),
    },
    {
      label: "Reports",
      icon: PieChart,
      href: "/reports",
      active: pathname === "/reports" || pathname.startsWith("/reports/"),
    },
    {
      label: "Billing",
      icon: CreditCard,
      href: "/billing",
      active: pathname === "/billing" || pathname.startsWith("/billing/"),
    },
    {
      label: "Profile",
      icon: User,
      href: "/profile",
      active: pathname === "/profile" || pathname.startsWith("/profile/"),
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings" || pathname.startsWith("/settings/"),
    },
  ]

  const sidebarContent = (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="px-3 py-2">
        <div className="flex h-16 items-center px-4">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">ComplexCare CRM</span>
          </Link>
        </div>
      </div>
      <ScrollArea className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                route.active ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <route.icon className="h-5 w-5" />
              {route.label}
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )

  return (
    <>
      <aside className="hidden h-screen w-64 border-r md:block">{sidebarContent}</aside>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden absolute left-4 top-4 z-50">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </>
  )
}
