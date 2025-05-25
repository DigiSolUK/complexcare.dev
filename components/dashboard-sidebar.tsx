import { LayoutDashboard, ListChecks, Settings, Wrench } from "lucide-react"

import type { MainNavItem, SidebarNavItem } from "@/types"

interface DashboardConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Support",
      href: "/support",
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "System",
      items: [
        {
          title: "Diagnostics",
          href: "/diagnostics",
          icon: ListChecks,
        },
        {
          title: "Auto Fix",
          href: "/diagnostics/auto-fix",
          icon: Wrench,
        },
        {
          title: "Settings",
          href: "/settings",
          icon: Settings,
        },
      ],
    },
  ],
}
