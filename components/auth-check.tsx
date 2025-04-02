"use client"

import type React from "react"

export function AuthCheck({ children }: { children: React.ReactNode }) {
  // In demo mode, we allow all access
  return <>{children}</>
}

