"use client"

import React from "react"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  componentPath?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

class ErrorBoundaryClass extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo })
    this.logErrorToServer(error, errorInfo)
  }

  logErrorToServer = async (error: Error, errorInfo: React.ErrorInfo) => {
    try {
      const componentPath =
        this.props.componentPath || errorInfo.componentStack?.split("\n")[1]?.trim() || "Unknown component"

      // Get browser information
      const browserInfo = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        url: window.location.href,
      }

      // Get tenant ID from environment variables
      const tenantId = process.env.DEFAULT_TENANT_ID || "ba367cfe-6de0-4180-9566-1002b75cf82c"

      // Send error to API endpoint
      await fetch("/api/error-logging", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          componentPath,
          browserInfo,
          severity: "high",
          tenant_id: tenantId, // Pass the tenant ID
        }),
      })
    } catch (loggingError) {
      console.error("Failed to log error to server:", loggingError)
    }
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <Card className="w-full max-w-md mx-auto my-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{this.state.error?.message || "An unexpected error occurred"}</AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground">The error has been logged and our team will look into it.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reload page
            </Button>
          </CardFooter>
        </Card>
      )
    }

    return this.props.children
  }
}

// React functional component wrapper
export function ErrorBoundary(props: ErrorBoundaryProps) {
  const [key, setKey] = useState(0)

  // Reset error boundary when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setKey((prev) => prev + 1)
    }

    window.addEventListener("popstate", handleRouteChange)

    return () => {
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [])

  return <ErrorBoundaryClass key={key} {...props} />
}
