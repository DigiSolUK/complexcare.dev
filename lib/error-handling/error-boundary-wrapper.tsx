"use client"

import type React from "react"
import { Component, type ErrorInfo, type ReactNode } from "react"
import { logError } from "./error-logger"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  component?: string
  route?: string
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Enhanced error boundary component with detailed logging
 */
export class ErrorBoundaryWrapper extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error
    logError(error, {
      component: this.props.component || "unknown",
      route: this.props.route || window.location.pathname,
      additionalInfo: {
        componentStack: errorInfo.componentStack,
      },
    })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Render fallback UI if provided, otherwise render default error UI
      return (
        this.props.fallback || (
          <div className="p-6 rounded-lg bg-red-50 border border-red-200">
            <h2 className="text-xl font-semibold text-red-700 mb-2">Something went wrong</h2>
            <p className="text-red-600 mb-4">
              We've logged this error and will look into it. Please try again or contact support if the problem
              persists.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
              <a
                href="/"
                className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors"
              >
                Return Home
              </a>
            </div>
            {process.env.NODE_ENV !== "production" && this.state.error && (
              <div className="mt-4 p-4 bg-gray-800 text-white rounded overflow-auto max-h-48">
                <p className="font-mono text-sm">{this.state.error.toString()}</p>
              </div>
            )}
          </div>
        )
      )
    }

    return this.props.children
  }
}

/**
 * HOC to wrap components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ErrorBoundaryProps, "children"> = {},
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <ErrorBoundaryWrapper {...options} component={Component.displayName || Component.name}>
        <Component {...props} />
      </ErrorBoundaryWrapper>
    )
  }

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  return WrappedComponent
}
