"use client"

import { useEffect } from "react"
import { toast } from "@/components/ui/use-toast"

export function ErrorMonitor() {
  useEffect(() => {
    // Global error handler for unhandled errors
    const handleError = (event: ErrorEvent) => {
      console.error("Global error:", event.error)

      // Log error to server
      fetch("/api/error-logging", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: event.error?.message || event.message,
          stack: event.error?.stack,
          componentPath: "Global Error Handler",
          severity: "high",
          browserInfo: {
            userAgent: navigator.userAgent,
            url: window.location.href,
          },
        }),
      }).catch(console.error)

      // Show user-friendly error message
      toast({
        title: "An error occurred",
        description: "We've been notified and are working on it.",
        variant: "destructive",
      })
    }

    // Global handler for unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason)

      // Log error to server
      fetch("/api/error-logging", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Unhandled promise rejection: ${event.reason}`,
          componentPath: "Promise Rejection Handler",
          severity: "high",
          browserInfo: {
            userAgent: navigator.userAgent,
            url: window.location.href,
          },
        }),
      }).catch(console.error)
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleRejection)
    }
  }, [])

  return null
}
