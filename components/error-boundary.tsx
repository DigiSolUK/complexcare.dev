"use client"

import React from "react"
import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { useRouter } from "next/navigation"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  componentPath?: string
  level?: "critical" | "section" | "component"
  resetOnRouteChange?: boolean
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
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

    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

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

      // Determine severity based on level prop
      const severity = this.props.level === "critical" ? "high" : this.props.level === "section" ? "medium" : "low"

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
          componentStack: errorInfo.componentStack,
          browserInfo,
          severity,
          tenant_id: tenantId,
          level: this.props.level || "component",
          timestamp: new Date().toISOString(),
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

      // Default fallback UI based on level
      switch (this.props.level) {
        case "critical":
          return <CriticalErrorFallback error={this.state.error} />
        case "section":
          return <SectionErrorFallback error={this.state.error} />
        default:
          return <ComponentErrorFallback error={this.state.error} />
      }
    }

    return this.props.children
  }
}

// React functional component wrapper
export function ErrorBoundary(props: ErrorBoundaryProps) {
  const [key, setKey] = useState(0)
  const router = useRouter()

  // Reset error boundary when route changes if resetOnRouteChange is true
  useEffect(() => {
    if (!props.resetOnRouteChange) return

    const handleRouteChange = () => {
      setKey((prev) => prev + 1)
    }

    window.addEventListener("popstate", handleRouteChange)

    return () => {
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [props.resetOnRouteChange])

  return <ErrorBoundaryClass key={key} {...props} />
}

// Critical error fallback (full page)
function CriticalErrorFallback({ error }: { error: Error | null }) {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="bg-red-50">
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            Critical Error
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Something went seriously wrong</AlertTitle>
            <AlertDescription>{error?.message || "An unexpected error occurred"}</AlertDescription>
          </Alert>
          <p className="text-sm text-muted-foreground mb-4">
            The application has encountered a critical error. Our team has been notified and is working to resolve the
            issue.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button onClick={() => window.location.reload()} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reload application
          </Button>
          <Button variant="outline" onClick={() => router.push("/")} className="w-full">
            <Home className="mr-2 h-4 w-4" />
            Return to home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// Section error fallback (contained within a section)
function SectionErrorFallback({ error }: { error: Error | null }) {
  return (
    <Card className="w-full my-4">
      <CardHeader className="bg-yellow-50">
        <CardTitle className="flex items-center gap-2 text-yellow-700">
          <AlertTriangle className="h-5 w-5" />
          Section Error
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground mb-2">This section encountered an error and cannot be displayed.</p>
        <p className="text-sm font-mono bg-gray-100 p-2 rounded">{error?.message || "Unknown error"}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => window.location.reload()} size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reload
        </Button>
      </CardFooter>
    </Card>
  )
}

// Component error fallback (small, inline)
function ComponentErrorFallback({ error }: { error: Error | null }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-3 my-2">
      <div className="flex items-center gap-2 text-red-700 text-sm font-medium">
        <AlertTriangle className="h-4 w-4" />
        Component Error
      </div>
      {isExpanded && (
        <p className="text-xs font-mono bg-white mt-2 p-2 rounded border border-red-100">
          {error?.message || "Unknown error"}
        </p>
      )}
      <div className="flex gap-2 mt-2">
        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-7 text-xs">
          {isExpanded ? "Hide details" : "Show details"}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => window.location.reload()} className="h-7 text-xs">
          <RefreshCw className="mr-1 h-3 w-3" />
          Reload
        </Button>
      </div>
    </div>
  )
}
