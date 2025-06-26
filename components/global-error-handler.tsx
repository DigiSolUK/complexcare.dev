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
      }).catch(async (err) => {
        let errorToLog = "Unknown error during error logging."
        if (err instanceof Response) {
          try {
            const text = await err.text()
            errorToLog = `Failed to log error to server: ${err.status} ${err.statusText} - ${text}`
          } catch (readErr) {
            errorToLog = `Failed to log error to server: ${err.status} ${err.statusText} - Could not read response body.`
          }
        } else if (err instanceof Error) {
          errorToLog = `Failed to log error to server: ${err.message} - ${err.stack}`
        } else {
          errorToLog = `Failed to log error to server: ${String(err)}`
        }
        originalConsoleError(errorToLog)
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
      }).catch(async (err) => {
        let errorToLog = "Unknown error during unhandled rejection logging."
        if (err instanceof Response) {
          try {
            const text = await err.text()
            errorToLog = `Failed to log unhandled rejection to server: ${err.status} ${err.statusText} - ${text}`
          } catch (readErr) {
            errorToLog = `Failed to log unhandled rejection to server: ${err.status} ${err.statusText} - Could not read response body.`
          }
        } else if (err instanceof Error) {
          errorToLog = `Failed to log unhandled rejection to server: ${err.message} - ${err.stack}`
        } else {
          errorToLog = `Failed to log unhandled rejection to server: ${String(err)}`
        }
        originalConsoleError(errorToLog)
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
      }).catch(async (err) => {
        let errorToLog = "Unknown error during uncaught error logging."
        if (err instanceof Response) {
          try {
            const text = await err.text()
            errorToLog = `Failed to log uncaught error to server: ${err.status} ${err.statusText} - ${text}`
          } catch (readErr) {
            errorToLog = `Failed to log uncaught error to server: ${err.status} ${err.statusText} - Could not read response body.`
          }
        } else if (err instanceof Error) {
          errorToLog = `Failed to log uncaught error to server: ${err.message} - ${err.stack}`
        } else {
          errorToLog = `Failed to log uncaught error to server: ${String(err)}`
        }
        originalConsoleError(errorToLog)
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
