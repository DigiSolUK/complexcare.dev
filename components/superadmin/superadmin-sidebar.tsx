"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Building2, Users, Settings, CreditCard, BarChart3, Shield, Bell, Lock } from "lucide-react"

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

export function SuperadminSidebar() {
  const items = [
    {
      href: "/superadmin",
      title: "Dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      color: "blue",
    },
    {
      href: "/superadmin/tenants",
      title: "Tenant Management",
      icon: <Building2 className="mr-2 h-4 w-4" />,
      color: "indigo",
    },
    {
      href: "/superadmin/users",
      title: "User Management",
      icon: <Users className="mr-2 h-4 w-4" />,
      color: "purple",
    },
    {
      href: "/superadmin/billing",
      title: "Billing & Subscriptions",
      icon: <CreditCard className="mr-2 h-4 w-4" />,
      color: "green",
    },
    {
      href: "/superadmin/analytics",
      title: "System Analytics",
      icon: <BarChart3 className="mr-2 h-4 w-4" />,
      color: "orange",
    },
    {
      href: "/superadmin/security",
      title: "Security",
      icon: <Shield className="mr-2 h-4 w-4" />,
      color: "red",
    },
    {
      href: "/superadmin/notifications",
      title: "Notifications",
      icon: <Bell className="mr-2 h-4 w-4" />,
      color: "yellow",
    },
    {
      href: "/superadmin/auth",
      title: "Auth0 Management",
      icon: <Lock className="mr-2 h-4 w-4" />,
      color: "blue",
    },
    {
      href: "/superadmin/settings",
      title: "System Settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
      color: "gray",
    },
  ]

  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Superadmin</h2>
        <SidebarNav items={items} />
      </div>
    </div>
  )
}
