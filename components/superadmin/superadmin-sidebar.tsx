"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, Users, Building2, Settings, PlusCircle } from "lucide-react"

export function SuperadminSidebar() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/superadmin",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/superadmin/tenants",
      label: "Tenants",
      icon: Building2,
    },
    {
      href: "/superadmin/create-tenant",
      label: "Create Tenant",
      icon: PlusCircle,
    },
    {
      href: "/superadmin/users",
      label: "Users",
      icon: Users,
    },
    {
      href: "/superadmin/settings",
      label: "Settings",
      icon: Settings,
    },
  ]

  return (
    <div className="flex h-full flex-col border-r bg-background">
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={pathname === route.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                pathname === route.href
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="mr-2 h-4 w-4" />
                {route.label}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
