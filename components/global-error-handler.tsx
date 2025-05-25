"use client"

import { useEffect } from "react"
import { captureException } from "@/lib/services/error-logging-service"

export function GlobalErrorHandler() {
  useEffect(() => {
    // Handler for uncaught exceptions
    const errorHandler = (event: ErrorEvent) => {
      event.preventDefault()
      captureException(event.error, {
        source: event.filename,
        line: event.lineno,
        column: event.colno,
        type: "uncaught-exception",
      })

      // You could show a global error toast here
      console.error("Uncaught error:", event.error)
    }

    // Handler for unhandled promise rejections
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      event.preventDefault()
      captureException(event.reason, {
        type: "unhandled-rejection",
      })

      // You could show a global error toast here
      console.error("Unhandled rejection:", event.reason)
    }

    // Add event listeners
    window.addEventListener("error", errorHandler)
    window.addEventListener("unhandledrejection", rejectionHandler)

    // Clean up
    return () => {
      window.removeEventListener("error", errorHandler)
      window.removeEventListener("unhandledrejection", rejectionHandler)
    }
  }, [])

  return null // This component doesn't render anything
}
