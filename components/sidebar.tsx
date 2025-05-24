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
  Brain,
  Stethoscope,
  UserCheck,
  DollarSign,
  Clock,
  FileSpreadsheet,
  Activity,
  Pill,
  CreditCard,
  Briefcase,
  FileEdit,
  ChevronLeft,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"

// Navigation items with correct routes
const navigationItems = [
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
    title: "Care Professionals",
    href: "/care-professionals",
    icon: UserCheck,
  },
  {
    title: "Appointments",
    href: "/appointments",
    icon: Calendar,
  },
  {
    title: "Clinical Notes",
    href: "/clinical-notes",
    icon: Stethoscope,
  },
  {
    title: "Care Plans",
    href: "/care-plans",
    icon: ClipboardList,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: ClipboardList,
  },
  {
    title: "Medications",
    href: "/medications",
    icon: Pill,
  },
  {
    title: "Documents",
    href: "/documents",
    icon: FileText,
  },
  {
    title: "Timesheets",
    href: "/timesheets",
    icon: Clock,
  },
  {
    title: "Invoicing",
    href: "/invoicing",
    icon: CreditCard,
  },
  {
    title: "Payroll",
    href: "/payroll/providers",
    icon: FileSpreadsheet,
  },
  {
    title: "Finances",
    href: "/finances",
    icon: DollarSign,
  },
  {
    title: "Compliance",
    href: "/compliance",
    icon: Shield,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    title: "AI Tools",
    href: "/ai-tools",
    icon: Brain,
  },
  {
    title: "Recruitment",
    href: "/recruitment",
    icon: Briefcase,
  },
  {
    title: "Content",
    href: "/content",
    icon: FileEdit,
  },
]

const adminItems = [
  {
    title: "Tenant Management",
    href: "/admin/tenant-management",
    icon: Building2,
  },
  {
    title: "System Health",
    href: "/admin/system-health",
    icon: Activity,
  },
]

const superAdminItems = [
  {
    title: "Super Admin",
    href: "/superadmin",
    icon: UserCheck,
  },
  {
    title: "All Tenants",
    href: "/superadmin/tenants",
    icon: Building2,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const isSuperAdmin = pathname?.startsWith("/superadmin")

  return (
    <div
      className={cn(
        "relative flex h-full flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className,
      )}
    >
      <div className="flex h-14 items-center justify-between px-4 border-b">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="font-bold">ComplexCare CRM</span>
          </Link>
        )}
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8">
          {isCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-4">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", isCollapsed && "px-2")}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                  {!isCollapsed && item.title}
                </Button>
              </Link>
            )
          })}
        </div>

        {adminItems.length > 0 && (
          <>
            <div className="my-2 border-t" />
            <div className="space-y-1 py-2">
              {!isCollapsed && (
                <p className="px-2 text-xs font-semibold text-muted-foreground uppercase">Administration</p>
              )}
              {adminItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")

                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn("w-full justify-start", isCollapsed && "px-2")}
                      title={isCollapsed ? item.title : undefined}
                    >
                      <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                      {!isCollapsed && item.title}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </>
        )}

        {isSuperAdmin && superAdminItems.length > 0 && (
          <>
            <div className="my-2 border-t" />
            <div className="space-y-1 py-2">
              {!isCollapsed && (
                <p className="px-2 text-xs font-semibold text-muted-foreground uppercase">Super Admin</p>
              )}
              {superAdminItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")

                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn("w-full justify-start", isCollapsed && "px-2")}
                      title={isCollapsed ? item.title : undefined}
                    >
                      <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                      {!isCollapsed && item.title}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </ScrollArea>

      <div className="border-t p-4">
        <Link href="/settings">
          <Button
            variant="ghost"
            className={cn("w-full justify-start", isCollapsed && "px-2")}
            title={isCollapsed ? "Settings" : undefined}
          >
            <Settings className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
            {!isCollapsed && "Settings"}
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
