"use client"

import type React from "react"

import { Component, type ReactNode } from "react"
import { SourceMappedError } from "@/components/error-boundaries/source-mapped-error"
import { useErrorTracking } from "@/components/error-tracking-provider"
import { ErrorSeverity, ErrorCategory } from "@/lib/services/error-logging-service"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  severity?: ErrorSeverity
  category?: ErrorCategory
  component?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ errorInfo })

    // Call the onError prop if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Report the error using the static reporter
    GlobalErrorReporter.reportError(error, {
      component: this.props.component,
      severity: this.props.severity,
      category: this.props.category,
      errorInfo,
    })
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render(): ReactNode {
    const { children, fallback } = this.props
    const { hasError, error } = this.state

    if (hasError && error) {
      if (fallback) {
        return fallback
      }

      return (
        <SourceMappedError
          error={error}
          resetError={this.resetError}
          severity={
            this.props.severity === ErrorSeverity.CRITICAL
              ? "critical"
              : this.props.severity === ErrorSeverity.HIGH
                ? "high"
                : this.props.severity === ErrorSeverity.LOW
                  ? "low"
                  : "medium"
          }
        />
      )
    }

    return children
  }
}

// Static reporter for class components to access the context
export class GlobalErrorReporter {
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
      component?: string
      severity?: ErrorSeverity
      category?: ErrorCategory
      errorInfo?: React.ErrorInfo
      [key: string]: any
    },
  ): void {
    if (GlobalErrorReporter.trackError) {
      GlobalErrorReporter.trackError(error, {
        severity: context.severity || ErrorSeverity.HIGH,
        category: context.category || ErrorCategory.UI,
        component: context.component || "unknown-component",
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
export function useInitializeGlobalErrorReporter(): void {
  const { trackError } = useErrorTracking()

  // Set the static trackError function
  GlobalErrorReporter.trackError = trackError
}

// Wrapper component to initialize the error reporter
export function ErrorBoundaryWithReporter(props: ErrorBoundaryProps) {
  useInitializeGlobalErrorReporter()
  return <ErrorBoundary {...props} />
}
