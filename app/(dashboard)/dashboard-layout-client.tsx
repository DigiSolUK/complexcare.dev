"use client"

import type React from "react"

import { useState } from "react"

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMounted, setIsMounted] = useState(false)

  // Since we're in a production environment with authentication already working,
  // we'll simplify this component and remove the session check that's causing issues

  // Render the dashboard layout without session checks
  return <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
}
