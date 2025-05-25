"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Users,
  Calendar,
  FileText,
  Clipboard,
  Clock,
  CreditCard,
  Settings,
  Home,
  Menu,
  X,
  Shield,
  Activity,
  BookOpen,
  Pill,
  BarChart2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { routes } from "@/lib/routes"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  const navItems = [
    {
      title: "Dashboard",
      href: routes.dashboard,
      icon: Home,
    },
    {
      title: "Patients",
      href: routes.patients.list,
      icon: Users,
    },
    {
      title: "Care Professionals",
      href: routes.careProfessionals.list,
      icon: Shield,
    },
    {
      title: "Appointments",
      href: routes.appointments,
      icon: Calendar,
    },
    {
      title: "Clinical Notes",
      href: routes.clinicalNotes,
      icon: FileText,
    },
    {
      title: "Care Plans",
      href: routes.carePlans,
      icon: BookOpen,
    },
    {
      title: "Medications",
      href: "/medications",
      icon: Pill,
    },
    {
      title: "Tasks",
      href: routes.tasks,
      icon: Clipboard,
    },
    {
      title: "Timesheets",
      href: routes.timesheets,
      icon: Clock,
    },
    {
      title: "Invoicing",
      href: routes.invoicing.list,
      icon: CreditCard,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart2,
    },
    {
      title: "Compliance",
      href: "/compliance",
      icon: Activity,
    },
    {
      title: "Settings",
      href: routes.settings.general,
      icon: Settings,
    },
  ]

  return (
    <div className={cn("relative border-r bg-background", className)}>
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className={cn("text-lg font-bold", collapsed ? "hidden" : "block")}>ComplexCare CRM</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="flex flex-col gap-2 p-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                collapsed ? "justify-center" : "",
              )}
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export default Sidebar
