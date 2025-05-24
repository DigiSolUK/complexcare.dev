"use client"

import type React from "react"

import { useEffect } from "react"
import { setupGlobalErrorHandling } from "@/lib/error-tracking"

interface ErrorTrackingProviderProps {
  children: React.ReactNode
}

export function ErrorTrackingProvider({ children }: ErrorTrackingProviderProps) {
  useEffect(() => {
    setupGlobalErrorHandling()
  }, [])

  return <>{children}</>
}
