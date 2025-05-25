"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface ErrorTrackingContextType {
  trackError: (error: Error, context?: Record<string, any>) => void
  clearErrors: () => void
  errors: ErrorRecord[]
}

interface ErrorRecord {
  id: string
  error: Error
  timestamp: Date
  context?: Record<string, any>
}

const ErrorTrackingContext = createContext<ErrorTrackingContextType | undefined>(undefined)

export function ErrorTrackingProvider({ children }: { children: ReactNode }) {
  const [errors, setErrors] = useState<ErrorRecord[]>([])

  const trackError = (error: Error, context?: Record<string, any>) => {
    const errorRecord: ErrorRecord = {
      id: generateErrorId(),
      error,
      timestamp: new Date(),
      context,
    }

    setErrors((prevErrors) => [...prevErrors, errorRecord])

    // In a real app, you would send this to your error tracking service
    console.error("Tracked error:", errorRecord)
  }

  const clearErrors = () => {
    setErrors([])
  }

  // Generate a unique ID for each error
  const generateErrorId = () => {
    return Math.random().toString(36).substring(2, 15)
  }

  // Set up global error handlers
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason))
      trackError(error, { type: "unhandledrejection" })
    }

    const handleError = (event: ErrorEvent) => {
      if (event.error) {
        trackError(event.error, {
          type: "error",
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
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
  }, [])

  return (
    <ErrorTrackingContext.Provider value={{ trackError, clearErrors, errors }}>
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
