"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Home, Calendar, FileText, Pill, Heart, MessageSquare, CreditCard, Settings, Phone } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/portal", icon: Home },
  { name: "Appointments", href: "/portal/appointments", icon: Calendar },
  { name: "Medical Records", href: "/portal/records", icon: FileText },
  { name: "Medications", href: "/portal/medications", icon: Pill },
  { name: "Vitals & Health", href: "/portal/health", icon: Heart },
  { name: "Messages", href: "/portal/messages", icon: MessageSquare },
  { name: "Billing", href: "/portal/billing", icon: CreditCard },
  { name: "Settings", href: "/portal/settings", icon: Settings },
]

export function PatientPortalSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow bg-white border-r">
        <div className="flex items-center justify-center h-16 px-4 border-b">
          <h2 className="text-lg font-bold text-primary">HealthCare Portal</h2>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t">
          <Link
            href="/portal/help"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
          >
            <Phone className="mr-3 h-5 w-5" />
            Help & Support
          </Link>
        </div>
      </div>
    </div>
  )
}
