"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  Calendar,
  Pill,
  ClipboardList,
  Clock,
  CreditCard,
  FileSpreadsheet,
  Shield,
  BarChart3,
  Brain,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  UserCog,
} from "lucide-react"

interface SidebarProps {
  className?: string
  isCollapsed?: boolean
  onToggle?: () => void
  userRole?: string
}

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "user", "super_admin"],
  },
  {
    title: "Patients",
    href: "/dashboard/patients",
    icon: Users,
    roles: ["admin", "user", "super_admin"],
  },
  {
    title: "Care Professionals",
    href: "/dashboard/care-professionals",
    icon: UserCheck,
    roles: ["admin", "user", "super_admin"],
  },
  {
    title: "Clinical Notes",
    href: "/dashboard/clinical-notes",
    icon: FileText,
    roles: ["admin", "user", "super_admin"],
  },
  {
    title: "Appointments",
    href: "/dashboard/appointments",
    icon: Calendar,
    roles: ["admin", "user", "super_admin"],
  },
  {
    title: "Care Plans",
    href: "/dashboard/care-plans",
    icon: ClipboardList,
    roles: ["admin", "user", "super_admin"],
  },
  {
    title: "Medications",
    href: "/dashboard/medications",
    icon: Pill,
    roles: ["admin", "user", "super_admin"],
  },
  {
    title: "Timesheets",
    href: "/dashboard/timesheets",
    icon: Clock,
    roles: ["admin", "user", "super_admin"],
  },
  {
    title: "Invoicing",
    href: "/dashboard/invoicing",
    icon: CreditCard,
    roles: ["admin", "super_admin"],
  },
  {
    title: "Payroll",
    href: "/dashboard/payroll",
    icon: FileSpreadsheet,
    roles: ["admin", "super_admin"],
  },
  {
    title: "Compliance",
    href: "/dashboard/compliance",
    icon: Shield,
    roles: ["admin", "super_admin"],
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    roles: ["admin", "super_admin"],
  },
  {
    title: "AI Tools",
    href: "/dashboard/ai-tools",
    icon: Brain,
    roles: ["admin", "user", "super_admin"],
  },
]

const superAdminItems = [
  {
    title: "Tenant Management",
    href: "/superadmin/tenants",
    icon: Building2,
    roles: ["super_admin"],
  },
  {
    title: "System Admin",
    href: "/superadmin",
    icon: UserCog,
    roles: ["super_admin"],
  },
]

export function Sidebar({ className, isCollapsed = false, onToggle, userRole = "user" }: SidebarProps) {
  const pathname = usePathname()

  const filteredNavItems = navigationItems.filter((item) => item.roles.includes(userRole))

  const filteredSuperAdminItems = superAdminItems.filter((item) => item.roles.includes(userRole))

  return (
    <div className={cn("flex h-full flex-col border-r bg-background", className)}>
      <div className="flex h-14 items-center justify-between px-4">
        {!isCollapsed && <h2 className="text-lg font-semibold">ComplexCare CRM</h2>}
        {onToggle && (
          <Button variant="ghost" size="sm" onClick={onToggle} className="h-8 w-8 p-0">
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2 py-4">
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", isCollapsed && "px-2", isActive && "bg-secondary")}
                >
                  <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                  {!isCollapsed && item.title}
                </Button>
              </Link>
            )
          })}
        </div>

        {filteredSuperAdminItems.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2 py-4">
              {!isCollapsed && (
                <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Super Admin
                </h3>
              )}
              {filteredSuperAdminItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn("w-full justify-start", isCollapsed && "px-2", isActive && "bg-secondary")}
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

      <Separator />

      <div className="p-4">
        <Link href="/dashboard/settings">
          <Button variant="ghost" className={cn("w-full justify-start", isCollapsed && "px-2")}>
            <Settings className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
            {!isCollapsed && "Settings"}
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
