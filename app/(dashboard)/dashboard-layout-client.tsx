"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Sidebar as DashboardSidebar } from "@/components/dashboard/sidebar"
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar"

interface DashboardLayoutClientProps {
  children: React.ReactNode
}

export const DashboardLayoutClient: React.FC<DashboardLayoutClientProps> = ({ children }) => {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <MobileSidebar />
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-[80] bg-gray-900">
        <DashboardSidebar />
      </div>
      <main className="md:pl-56 pt-16 h-full">{children}</main>
    </>
  )
}
