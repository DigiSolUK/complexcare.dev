"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  Shield,
  BarChart3,
  Brain,
  Settings,
  LogOut,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

export function MobileSidebar() {
  const pathname = usePathname()

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/mobile",
      icon: LayoutDashboard,
    },
    {
      title: "Patients",
      href: "/mobile/patients",
      icon: Users,
    },
    {
      title: "Care Professionals",
      href: "/mobile/care-professionals",
      icon: UserCheck,
    },
    {
      title: "Clinical Notes",
      href: "/mobile/notes",
      icon: FileText,
    },
    {
      title: "Appointments",
      href: "/mobile/appointments",
      icon: Calendar,
    },
    {
      title: "Care Plans",
      href: "/mobile/care-plans",
      icon: ClipboardList,
    },
    {
      title: "Medications",
      href: "/mobile/medications",
      icon: Pill,
    },
    {
      title: "Tasks",
      href: "/mobile/tasks",
      icon: ClipboardList,
    },
    {
      title: "Timesheets",
      href: "/mobile/timesheets",
      icon: Clock,
    },
    {
      title: "Invoicing",
      href: "/mobile/invoicing",
      icon: CreditCard,
    },
    {
      title: "Compliance",
      href: "/mobile/compliance",
      icon: Shield,
    },
    {
      title: "Analytics",
      href: "/mobile/analytics",
      icon: BarChart3,
    },
    {
      title: "AI Tools",
      href: "/mobile/ai-tools",
      icon: Brain,
    },
  ]

  return (
    <div className="flex flex-col h-full py-4">
      <div className="px-3 py-2">
        <div className="flex items-center mb-6">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarFallback>CP</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Dr. Sarah Johnson</p>
            <p className="text-sm text-muted-foreground">Care Professional</p>
          </div>
        </div>
      </div>
      <Separator className="mb-4" />
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

            return (
              <Link key={item.href} href={item.href}>
                <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                  <Icon className="mr-3 h-5 w-5" />
                  {item.title}
                </Button>
              </Link>
            )
          })}
        </div>
      </ScrollArea>
      <Separator className="my-4" />
      <div className="px-3 py-2">
        <Link href="/mobile/settings">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Button>
        </Link>
        <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
