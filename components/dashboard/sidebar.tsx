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
  Brain,
  Stethoscope,
  UserCheck,
  DollarSign,
  Clock,
  FileSpreadsheet,
} from "lucide-react"

const sidebarNavItems = [
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
    icon: FileText,
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
    icon: DollarSign,
  },
  {
    title: "Payroll",
    href: "/payroll",
    icon: FileSpreadsheet,
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

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("hidden h-full border-r bg-background md:flex md:w-64 md:flex-col", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">ComplexCare CRM</h2>
            <nav className="flex flex-col space-y-1">
              {sidebarNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href || (pathname?.startsWith(item.href) && item.href !== "/dashboard")
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

// Add this named export to match what's being imported
export const DashboardSidebar = Sidebar

export default Sidebar
