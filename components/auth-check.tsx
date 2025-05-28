"use client"

import type React from "react"

export function AuthCheck({ children }: { children: React.ReactNode }) {
  // Always render children in the preview environment
  return <>{children}</>
}
