"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  FileText,
  Settings,
  Shield,
  BarChart,
  Building2,
  CreditCard,
  Brain,
} from "lucide-react"

// Super admin sidebar items
const superAdminItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Tenants",
    href: "/tenants",
    icon: Building2,
  },
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
  {
    title: "AI Tools",
    href: "/ai-tools",
    icon: Brain,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

// Tenant admin sidebar items
const tenantAdminItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Patients",
    href: "/patients",
    icon: Users,
  },
  {
    title: "Appointments",
    href: "/appointments",
    icon: Calendar,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: ClipboardList,
  },
  {
    title: "Documents",
    href: "/documents",
    icon: FileText,
  },
  {
    title: "Compliance",
    href: "/compliance",
    icon: Shield,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart,
  },
  {
    title: "AI Tools",
    href: "/ai-tools",
    icon: Brain,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  // For this implementation, we'll assume the current user is a superadmin
  // In a real implementation, you would check the user's role from the session
  const isSuperAdmin = true
  const sidebarNavItems = isSuperAdmin ? superAdminItems : tenantAdminItems

  return (
    <div className="hidden border-r md:block">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          {isSuperAdmin && (
            <div className="mb-4 px-4">
              <div className="rounded-md bg-primary/10 p-2 text-center">
                <span className="text-xs font-semibold text-primary">SUPER ADMIN</span>
              </div>
            </div>
          )}
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">Menu</h2>
            <nav className="flex flex-col space-y-1">
              {sidebarNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href || (pathname?.startsWith(item.href) && item.href !== "/")
                      ? "bg-accent text-accent-foreground"
                      : "transparent",
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
