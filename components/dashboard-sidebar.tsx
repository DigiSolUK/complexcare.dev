import { Building2, LayoutDashboard, type LucideIcon, Package2, Settings, ShoppingBag, Users } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  permission?: string[]
}

interface NavSection {
  title: string
  items: NavItem[]
}

export const dashboardNavItems: NavSection[] = [
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
    title: "Management",
    items: [
      {
        title: "Users",
        href: "/dashboard/users",
        icon: Users,
        permission: ["admin", "superadmin"],
      },
      {
        title: "Products",
        href: "/dashboard/products",
        icon: Package2,
        permission: ["admin", "superadmin"],
      },
      {
        title: "Orders",
        href: "/dashboard/orders",
        icon: ShoppingBag,
        permission: ["admin", "superadmin"],
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        title: "General",
        href: "/settings",
        icon: Settings,
      },
      {
        title: "Database",
        href: "/settings/database",
        icon: Building2,
        permission: ["admin", "superadmin"],
      },
    ],
  },
]
