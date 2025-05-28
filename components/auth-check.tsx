"use client"

import type React from "react"

export function AuthCheck({ children }: { children: React.ReactNode }) {
  // In public mode, we allow all access
  return <>{children}</>
}
