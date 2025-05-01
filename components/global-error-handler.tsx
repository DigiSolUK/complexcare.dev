"use client"

import { useEffect } from "react"

export function GlobalErrorHandler() {
  useEffect(() => {
    // Store original console.error
    const originalConsoleError = console.error

    // Override console.error to log errors to server
    console.error = (...args) => {
      // Call original console.error
      originalConsoleError.apply(console, args)

      // Extract error information
      const errorMessage = args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg))).join(" ")

      // Log error to server
      fetch("/api/error-logging", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Console error: ${errorMessage}`,
          componentPath: "console",
          severity: "medium",
          browserInfo: {
            userAgent: navigator.userAgent,
            url: window.location.href,
          },
        }),
      }).catch((err) => {
        // Don't use console.error here to avoid infinite loop
        originalConsoleError("Failed to log error to server:", err)
      })
    }

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Log error to server
      fetch("/api/error-logging", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Unhandled promise rejection: ${event.reason}`,
          stack: event.reason?.stack,
          componentPath: "unhandled-promise",
          severity: "high",
          browserInfo: {
            userAgent: navigator.userAgent,
            url: window.location.href,
          },
        }),
      }).catch((err) => {
        console.error("Failed to log unhandled rejection to server:", err)
      })
    }

    // Handle uncaught errors
    const handleUncaughtError = (event: ErrorEvent) => {
      // Log error to server
      fetch("/api/error-logging", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: event.message,
          stack: event.error?.stack,
          componentPath: event.filename || "unknown",
          severity: "high",
          browserInfo: {
            userAgent: navigator.userAgent,
            url: window.location.href,
            lineNumber: event.lineno,
            columnNumber: event.colno,
          },
        }),
      }).catch((err) => {
        console.error("Failed to log uncaught error to server:", err)
      })
    }

    // Add event listeners
    window.addEventListener("unhandledrejection", handleUnhandledRejection)
    window.addEventListener("error", handleUncaughtError)

    // Clean up on unmount
    return () => {
      console.error = originalConsoleError
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
      window.removeEventListener("error", handleUncaughtError)
    }
  }, [])

  return null
}
