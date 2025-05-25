"use client"

import { useEffect } from "react"

export function GlobalErrorHandler() {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled Promise Rejection:", event.reason)

      // Prevent the default browser behavior (console error)
      event.preventDefault()
    }

    const handleError = (event: ErrorEvent) => {
      console.error("Global Error:", event.error)

      // Prevent the default browser behavior (console error)
      event.preventDefault()
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

  return null
}
