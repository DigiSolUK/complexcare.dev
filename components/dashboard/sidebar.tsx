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
  Briefcase,
  FileEdit,
  PieChart,
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Main</h2>
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/dashboard" ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <Home className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/patients"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname.startsWith("/patients") ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <Users className="mr-2 h-4 w-4" />
              <span>Patients</span>
            </Link>
            <Link
              href="/care-professionals"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname.startsWith("/care-professionals") ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <Users className="mr-2 h-4 w-4" />
              <span>Care Professionals</span>
            </Link>
            <Link
              href="/appointments"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname.startsWith("/appointments") ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              <span>Appointments</span>
            </Link>
            <Link
              href="/care-plans"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname.startsWith("/care-plans") ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              <span>Care Plans</span>
            </Link>
            <Link
              href="/tasks"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname.startsWith("/tasks") ? "bg-accent text-accent-foreground" : "transparent",
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
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname.startsWith("/timesheets") ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <Clock className="mr-2 h-4 w-4" />
              <span>Timesheets</span>
            </Link>
            <Link
              href="/documents"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname.startsWith("/documents") ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>Documents</span>
            </Link>
            <Link
              href="/invoicing"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname.startsWith("/invoicing") ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <Wallet className="mr-2 h-4 w-4" />
              <span>Invoicing</span>
            </Link>
            <Link
              href="/compliance"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname.startsWith("/compliance") ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <Shield className="mr-2 h-4 w-4" />
              <span>Compliance</span>
            </Link>
            <Link
              href="/recruitment"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname.startsWith("/recruitment") ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              <span>Recruitment</span>
            </Link>
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">System</h2>
          <div className="space-y-1">
            <Link
              href="/content"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname.startsWith("/content") ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <FileEdit className="mr-2 h-4 w-4" />
              <span>Content</span>
            </Link>
            <Link
              href="/analytics"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname.startsWith("/analytics") ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Analytics</span>
            </Link>
            <Link
              href="/reports"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname.startsWith("/reports") ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <PieChart className="mr-2 h-4 w-4" />
              <span>Reports</span>
            </Link>
            <Link
              href="/settings"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname.startsWith("/settings") ? "bg-accent text-accent-foreground" : "transparent",
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

