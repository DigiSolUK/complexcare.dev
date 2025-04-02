"use client"

import type React from "react"

export function SessionProvider({ children }: { children: React.ReactNode }) {
  // Simple passthrough provider in demo mode
  return <>{children}</>
}

