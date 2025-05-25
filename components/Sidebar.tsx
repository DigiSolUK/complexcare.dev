"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  Users,
  Calendar,
  FileText,
  CheckSquare,
  Lightbulb,
  Activity,
  Settings,
  Clock,
  File,
  CreditCard,
  Shield,
  Briefcase,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    administration: false,
    system: false,
  })

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  const mainItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Patients",
      href: "/patients",
      icon: Users,
    },
    {
      name: "Care Professionals",
      href: "/care-professionals",
      icon: Users,
    },
    {
      name: "Appointments",
      href: "/appointments",
      icon: Calendar,
    },
    {
      name: "Care Plans",
      href: "/care-plans",
      icon: FileText,
    },
    {
      name: "Tasks",
      href: "/tasks",
      icon: CheckSquare,
    },
    {
      name: "AI Tools",
      href: "/ai-tools",
      icon: Lightbulb,
    },
    {
      name: "Clinical Decision Support",
      href: "/clinical-decision-support",
      icon: Activity,
    },
  ]

  const adminItems = [
    {
      name: "Timesheets",
      href: "/timesheets",
      icon: Clock,
    },
    {
      name: "Documents",
      href: "/documents",
      icon: File,
    },
    {
      name: "Invoicing",
      href: "/invoicing",
      icon: CreditCard,
    },
    {
      name: "Compliance",
      href: "/compliance",
      icon: Shield,
    },
    {
      name: "Recruitment",
      href: "/recruitment",
      icon: Briefcase,
    },
  ]

  const systemItems = [
    {
      name: "Content",
      href: "/content",
      icon: FileText,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: Activity,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-white border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className,
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && <h1 className="text-xl font-bold">ComplexCare</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-gray-100"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-3 py-2">
          {!isCollapsed && <h2 className="mb-2 px-4 text-xs font-semibold text-gray-500">Main</h2>}
          <nav className="space-y-1">
            {mainItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2 text-sm rounded-md",
                  isActive(item.href) ? "bg-primary text-primary-foreground" : "text-gray-700 hover:bg-gray-100",
                  isCollapsed && "justify-center",
                )}
              >
                <item.icon size={20} className={cn(isCollapsed ? "mx-0" : "mr-3")} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>

        <div className="px-3 py-2">
          {!isCollapsed && (
            <button
              onClick={() => toggleMenu("administration")}
              className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-gray-500"
            >
              <span>Administration</span>
              {openMenus.administration ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          {(isCollapsed || openMenus.administration) && (
            <nav className="space-y-1 mt-1">
              {adminItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm rounded-md",
                    isActive(item.href) ? "bg-primary text-primary-foreground" : "text-gray-700 hover:bg-gray-100",
                    isCollapsed && "justify-center",
                  )}
                >
                  <item.icon size={20} className={cn(isCollapsed ? "mx-0" : "mr-3")} />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="px-3 py-2">
          {!isCollapsed && (
            <button
              onClick={() => toggleMenu("system")}
              className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-gray-500"
            >
              <span>System</span>
              {openMenus.system ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          {(isCollapsed || openMenus.system) && (
            <nav className="space-y-1 mt-1">
              {systemItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm rounded-md",
                    isActive(item.href) ? "bg-primary text-primary-foreground" : "text-gray-700 hover:bg-gray-100",
                    isCollapsed && "justify-center",
                  )}
                >
                  <item.icon size={20} className={cn(isCollapsed ? "mx-0" : "mr-3")} />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>

      <div className="p-4 border-t">
        <Link
          href="/diagnostics"
          className={cn(
            "flex items-center px-4 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100",
            isCollapsed && "justify-center",
          )}
        >
          <Activity size={20} className={cn(isCollapsed ? "mx-0" : "mr-3")} />
          {!isCollapsed && <span>Diagnostics</span>}
        </Link>
      </div>
    </div>
  )
}
