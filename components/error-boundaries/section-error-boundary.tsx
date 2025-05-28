"use client"

import type React from "react"

import { Component, type ReactNode } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useErrorTracking } from "@/components/error-tracking-provider"
import { ErrorSeverity, ErrorCategory } from "@/lib/services/error-logging-service"
import { getUserFriendlyErrorMessage } from "@/lib/error-tracking"

interface SectionErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  section?: string
  severity?: ErrorSeverity
  category?: ErrorCategory
}

interface SectionErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

export class SectionErrorBoundary extends Component<SectionErrorBoundaryProps, SectionErrorBoundaryState> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): SectionErrorBoundaryState {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ errorInfo })

    // Access the error tracking context through ErrorReporter
    ErrorReporter.reportError(error, {
      section: this.props.section,
      severity: this.props.severity,
      category: this.props.category,
      errorInfo,
    })
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render(): ReactNode {
    const { children, fallback, section } = this.props
    const { hasError, error } = this.state

    if (hasError && error) {
      if (fallback) {
        return fallback
      }

      return <SectionErrorFallback error={error} section={section} resetError={this.resetError} />
    }

    return children
  }
}

// Static reporter for class components to access the context
export class ErrorReporter {
  static trackError:
    | ((
        error: Error,
        options?: {
          severity?: ErrorSeverity
          category?: ErrorCategory
          context?: Record<string, any>
          component?: string
          action?: string
        },
      ) => void)
    | null = null

  static reportError(
    error: Error,
    context: {
      section?: string
      severity?: ErrorSeverity
      category?: ErrorCategory
      errorInfo?: React.ErrorInfo
      [key: string]: any
    },
  ): void {
    if (ErrorReporter.trackError) {
      ErrorReporter.trackError(error, {
        severity: context.severity || ErrorSeverity.HIGH,
        category: context.category || ErrorCategory.UI,
        component: context.section || "unknown-section",
        action: "render",
        context: {
          componentStack: context.errorInfo?.componentStack,
          ...context,
        },
      })
    } else {
      console.error("Error tracking not initialized:", error, context)
    }
  }
}

// Hook to initialize the error reporter
export function useInitializeErrorReporter(): void {
  const { trackError } = useErrorTracking()

  // Set the static trackError function
  ErrorReporter.trackError = trackError
}

// Fallback UI for section errors
function SectionErrorFallback({
  error,
  section,
  resetError,
}: {
  error: Error
  section?: string
  resetError: () => void
}) {
  const friendlyMessage = getUserFriendlyErrorMessage(error)

  return (
    <Card className="w-full shadow border-red-200 dark:border-red-800">
      <CardHeader className="bg-red-50 dark:bg-red-900/30 border-b border-red-100 dark:border-red-800 py-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-700 dark:text-red-300">
          <AlertTriangle className="h-4 w-4" />
          {section ? `Error in ${section}` : "Section Error"}
        </CardTitle>
      </CardHeader>
      <CardContent className="py-3 text-sm">
        <p className="text-gray-600 dark:text-gray-300">{friendlyMessage}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Technical details: {error.message}</p>
      </CardContent>
      <CardFooter className="border-t border-red-100 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10 py-2">
        <Button variant="outline" size="sm" onClick={resetError} className="gap-1 text-xs">
          <RefreshCw className="h-3 w-3" />
          Retry
        </Button>
      </CardFooter>
    </Card>
  )
}

// Wrapper component to initialize the error reporter
export function SectionErrorBoundaryWithReporter(props: SectionErrorBoundaryProps) {
  useInitializeErrorReporter()
  return <SectionErrorBoundary {...props} />
}
