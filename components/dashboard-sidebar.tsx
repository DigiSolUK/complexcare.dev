"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Calendar,
  ClipboardList,
  FileText,
  Home,
  Settings,
  Users,
  Wallet,
  Clock,
  FileCheck,
  Shield,
  PieChart,
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardSidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12 border-r w-64 bg-white hidden md:block", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Main</h2>
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900",
                pathname === "/dashboard" ? "bg-gray-100 text-gray-900" : "text-gray-700",
              )}
            >
              <Home className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/patients"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900",
                pathname.startsWith("/patients") ? "bg-gray-100 text-gray-900" : "text-gray-700",
              )}
            >
              <Users className="mr-2 h-4 w-4" />
              <span>Patients</span>
            </Link>
            <Link
              href="/care-professionals"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900",
                pathname.startsWith("/care-professionals") ? "bg-gray-100 text-gray-900" : "text-gray-700",
              )}
            >
              <Users className="mr-2 h-4 w-4" />
              <span>Care Professionals</span>
            </Link>
            <Link
              href="/appointments"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900",
                pathname.startsWith("/appointments") ? "bg-gray-100 text-gray-900" : "text-gray-700",
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              <span>Appointments</span>
            </Link>
            <Link
              href="/care-plans"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900",
                pathname.startsWith("/care-plans") ? "bg-gray-100 text-gray-900" : "text-gray-700",
              )}
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              <span>Care Plans</span>
            </Link>
            <Link
              href="/tasks"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900",
                pathname.startsWith("/tasks") ? "bg-gray-100 text-gray-900" : "text-gray-700",
              )}
            >
              <FileCheck className="mr-2 h-4 w-4" />
              <span>Tasks</span>
            </Link>
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Administration</h2>
          <div className="space-y-1">
            <Link
              href="/timesheets"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900",
                pathname.startsWith("/timesheets") ? "bg-gray-100 text-gray-900" : "text-gray-700",
              )}
            >
              <Clock className="mr-2 h-4 w-4" />
              <span>Timesheets</span>
            </Link>
            <Link
              href="/documents"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900",
                pathname.startsWith("/documents") ? "bg-gray-100 text-gray-900" : "text-gray-700",
              )}
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>Documents</span>
            </Link>
            <Link
              href="/invoicing"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900",
                pathname.startsWith("/invoicing") ? "bg-gray-100 text-gray-900" : "text-gray-700",
              )}
            >
              <Wallet className="mr-2 h-4 w-4" />
              <span>Invoicing</span>
            </Link>
            <Link
              href="/compliance"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900",
                pathname.startsWith("/compliance") ? "bg-gray-100 text-gray-900" : "text-gray-700",
              )}
            >
              <Shield className="mr-2 h-4 w-4" />
              <span>Compliance</span>
            </Link>
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">System</h2>
          <div className="space-y-1">
            <Link
              href="/analytics"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900",
                pathname.startsWith("/analytics") ? "bg-gray-100 text-gray-900" : "text-gray-700",
              )}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Analytics</span>
            </Link>
            <Link
              href="/reports"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900",
                pathname.startsWith("/reports") ? "bg-gray-100 text-gray-900" : "text-gray-700",
              )}
            >
              <PieChart className="mr-2 h-4 w-4" />
              <span>Reports</span>
            </Link>
            <Link
              href="/settings"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900",
                pathname.startsWith("/settings") ? "bg-gray-100 text-gray-900" : "text-gray-700",
              )}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
