"use client"

import { useEffect } from "react"
import { setupGlobalErrorHandling } from "@/lib/error-tracking"

export function GlobalErrorHandler() {
  useEffect(() => {
    setupGlobalErrorHandling()
  }, [])

  return null
}
