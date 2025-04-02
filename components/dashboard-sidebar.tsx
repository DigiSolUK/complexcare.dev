"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Calendar,
  ClipboardList,
  FileText,
  Pill,
  Settings,
  Users,
  CreditCard,
  Briefcase,
  FileEdit,
  LayoutDashboard,
  Shield,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: React.ReactNode
    color?: string
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex flex-col gap-2", className)} {...props}>
      {items.map((item) => {
        const isActive = pathname === item.href
        return (
          <Button
            key={item.href}
            variant={isActive ? "default" : "ghost"}
            className={cn(
              "justify-start",
              isActive && item.color
                ? `bg-${item.color}-100 text-${item.color}-700 hover:bg-${item.color}-200 hover:text-${item.color}-800`
                : "",
              !isActive && item.color
                ? `text-${item.color}-600 hover:bg-${item.color}-100 hover:text-${item.color}-700`
                : "",
            )}
            asChild
          >
            <Link href={item.href}>
              {item.icon}
              {item.title}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}

export function DashboardSidebar() {
  const items = [
    {
      href: "/dashboard",
      title: "Dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      color: "blue",
    },
    {
      href: "/patients",
      title: "Patients",
      icon: <Users className="mr-2 h-4 w-4" />,
      color: "indigo",
    },
    {
      href: "/medications",
      title: "Medications",
      icon: <Pill className="mr-2 h-4 w-4" />,
      color: "cyan",
    },
    {
      href: "/care-professionals",
      title: "Care Professionals",
      icon: <Users className="mr-2 h-4 w-4" />,
      color: "purple",
    },
    {
      href: "/appointments",
      title: "Appointments",
      icon: <Calendar className="mr-2 h-4 w-4" />,
      color: "purple",
    },
    {
      href: "/documents",
      title: "Documents",
      icon: <FileText className="mr-2 h-4 w-4" />,
      color: "teal",
    },
    {
      href: "/finances",
      title: "Finances",
      icon: <CreditCard className="mr-2 h-4 w-4" />,
      color: "green",
    },
    {
      href: "/tasks",
      title: "Tasks",
      icon: <ClipboardList className="mr-2 h-4 w-4" />,
      color: "yellow",
    },
    {
      href: "/analytics",
      title: "Analytics",
      icon: <BarChart3 className="mr-2 h-4 w-4" />,
      color: "orange",
    },
    {
      href: "/compliance",
      title: "Compliance",
      icon: <Shield className="mr-2 h-4 w-4" />,
      color: "blue",
    },
    {
      href: "/recruitment",
      title: "Recruitment",
      icon: <Briefcase className="mr-2 h-4 w-4" />,
      color: "red",
    },
    {
      href: "/content",
      title: "Content",
      icon: <FileEdit className="mr-2 h-4 w-4" />,
      color: "pink",
    },
    {
      href: "/settings",
      title: "Settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
      color: "gray",
    },
  ]

  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Navigation</h2>
        <SidebarNav items={items} />
      </div>
    </div>
  )
}

