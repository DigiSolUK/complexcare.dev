"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/Sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { SectionErrorBoundary } from "@/components/error-boundaries"

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [userRole, setUserRole] = useState<string>("admin")
  const pathname = usePathname()

  // Simulate fetching user role from API
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll just simulate it
        await new Promise((resolve) => setTimeout(resolve, 100))
        setUserRole("admin")
      } catch (error) {
        console.error("Error fetching user role:", error)
        setUserRole("user") // Default to user role on error
      }
    }

    fetchUserRole()
  }, [])

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          className={`h-screen ${isSidebarCollapsed ? "w-[70px]" : "w-64"} transition-all duration-300 ease-in-out`}
          isCollapsed={isSidebarCollapsed}
          onToggle={toggleSidebar}
          userRole={userRole}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
            <SectionErrorBoundary>{children}</SectionErrorBoundary>
          </main>
        </div>
      </div>
    </>
  )
}
