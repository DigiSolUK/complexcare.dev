import { Calendar, FileText, Home, LayoutDashboard, ListChecks, Settings, User, Video } from "lucide-react"

import type { NavItem } from "@/types"

export const dashboardNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview of your account",
  },
  {
    title: "Home",
    href: "/",
    icon: Home,
    description: "Go to home page",
  },
  {
    title: "Appointments",
    href: "/appointments",
    icon: Calendar,
    description: "Manage your appointments",
  },
  {
    title: "Telemedicine",
    href: "/telemedicine",
    icon: Video,
    description: "Video consultations",
  },
  {
    title: "Patients",
    href: "/patients",
    icon: User,
    description: "Manage your patients",
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
    description: "View your reports",
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: ListChecks,
    description: "Manage your tasks",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Manage your settings",
  },
]
