"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { captureException, ErrorSeverity, ErrorCategory } from "@/lib/services/error-logging-service"
import { useSession } from "next-auth/react"
import { useTenantContext } from "@/lib/tenant-context"

interface ErrorRecord {
  id: string
  error: Error
  timestamp: Date
  context?: Record<string, any>
  severity: ErrorSeverity
  category: ErrorCategory
  handled: boolean
}

interface ErrorTrackingContextType {
  trackError: (
    error: Error,
    options?: {
      severity?: ErrorSeverity
      category?: ErrorCategory
      context?: Record<string, any>
      component?: string
      action?: string
    },
  ) => void
  clearErrors: () => void
  errors: ErrorRecord[]
  lastError: ErrorRecord | null
}

const ErrorTrackingContext = createContext<ErrorTrackingContextType | undefined>(undefined)

export function ErrorTrackingProvider({ children }: { children: ReactNode }) {
  const [errors, setErrors] = useState<ErrorRecord[]>([])
  const [lastError, setLastError] = useState<ErrorRecord | null>(null)
  const { data: session } = useSession()
  const tenantContext = useTenantContext()

  const userId = session?.user?.id
  const tenantId = tenantContext?.currentTenant?.id

  const trackError = useCallback(
    (
      error: Error,
      options?: {
        severity?: ErrorSeverity
        category?: ErrorCategory
        context?: Record<string, any>
        component?: string
        action?: string
      },
    ) => {
      const {
        severity = ErrorSeverity.MEDIUM,
        category = ErrorCategory.SYSTEM,
        context = {},
        component,
        action,
      } = options || {}

      const errorRecord: ErrorRecord = {
        id: generateErrorId(),
        error,
        timestamp: new Date(),
        context,
        severity,
        category,
        handled: true,
      }

      setErrors((prevErrors) => [...prevErrors, errorRecord])
      setLastError(errorRecord)

      // Capture the error with our error logging service
      captureException(error, {
        userId,
        tenantId,
        component,
        action,
        severity,
        category,
        ...context,
        timestamp: new Date().toISOString(),
        url: typeof window !== "undefined" ? window.location.href : undefined,
        handled: true,
      })
    },
    [userId, tenantId],
  )

  const clearErrors = useCallback(() => {
    setErrors([])
    setLastError(null)
  }, [])

  // Generate a unique ID for each error
  const generateErrorId = () => {
    return Math.random().toString(36).substring(2, 15)
  }

  // Set up global error handlers
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason))

      const errorRecord: ErrorRecord = {
        id: generateErrorId(),
        error,
        timestamp: new Date(),
        context: { type: "unhandledrejection" },
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.SYSTEM,
        handled: false,
      }

      setErrors((prevErrors) => [...prevErrors, errorRecord])
      setLastError(errorRecord)

      // Capture the error with our error logging service
      captureException(error, {
        userId,
        tenantId,
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.SYSTEM,
        type: "unhandledrejection",
        timestamp: new Date().toISOString(),
        url: window.location.href,
        handled: false,
      })
    }

    const handleError = (event: ErrorEvent) => {
      // Ignore errors from external scripts
      if (event.filename && !event.filename.includes(window.location.origin)) {
        return
      }

      if (event.error) {
        const errorRecord: ErrorRecord = {
          id: generateErrorId(),
          error: event.error,
          timestamp: new Date(),
          context: {
            type: "error",
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
          },
          severity: ErrorSeverity.HIGH,
          category: ErrorCategory.SYSTEM,
          handled: false,
        }

        setErrors((prevErrors) => [...prevErrors, errorRecord])
        setLastError(errorRecord)

        // Capture the error with our error logging service
        captureException(event.error, {
          userId,
          tenantId,
          severity: ErrorSeverity.HIGH,
          category: ErrorCategory.SYSTEM,
          type: "error",
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          handled: false,
        })
      }
    }

    // Add event listeners
    window.addEventListener("unhandledrejection", handleUnhandledRejection)
    window.addEventListener("error", handleError)

    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
      window.removeEventListener("error", handleError)
    }
  }, [userId, tenantId])

  return (
    <ErrorTrackingContext.Provider value={{ trackError, clearErrors, errors, lastError }}>
      {children}
    </ErrorTrackingContext.Provider>
  )
}

export function useErrorTracking() {
  const context = useContext(ErrorTrackingContext)
  if (context === undefined) {
    throw new Error("useErrorTracking must be used within an ErrorTrackingProvider")
  }
  return context
}
