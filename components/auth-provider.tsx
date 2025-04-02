"use client"

import type { ReactNode } from "react"

export function AuthProvider({ children }: { children: ReactNode }) {
  // Simple wrapper since we're in demo mode
  return <>{children}</>
}

