"use client"

import { useEffect } from "react"
import type React from "react"
import { SessionProvider } from "next-auth/react"

import { ThemeProvider } from "@/components/theme-provider"
import { TenantProvider } from "@/components/providers/tenant-provider"
import { Toaster } from "@/components/ui/toaster"
import { captureException, ErrorSeverity, ErrorCategory } from "@/lib/services/error-logging-service"

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Global error handler for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason)

      // Capture the error with our error logging service
      captureException(event.reason, {
        component: "Global",
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.CLIENT,
        metadata: {
          type: "unhandledRejection",
          promise: event.promise,
        },
      })

      // Prevent the default error handling
      event.preventDefault()
    }

    // Global error handler for uncaught errors
    const handleError = (event: ErrorEvent) => {
      console.error("Uncaught error:", event.error)

      // Capture the error with our error logging service
      captureException(event.error, {
        component: "Global",
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.CLIENT,
        metadata: {
          type: "uncaughtError",
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      })
    }

    // Add event listeners
    window.addEventListener("unhandledrejection", handleUnhandledRejection)
    window.addEventListener("error", handleError)

    // Cleanup
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
      window.removeEventListener("error", handleError)
    }
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SessionProvider>
        <TenantProvider>
          {children}
          <Toaster />
        </TenantProvider>
      </SessionProvider>
    </ThemeProvider>
  )
}
