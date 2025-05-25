"use client"

import type React from "react"
import { Component, isValidElement } from "react"

interface ErrorBoundaryProps {
  fallback: React.ComponentType<{ error: Error; resetError: () => void }> | React.ReactNode
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): React.ReactNode {
    const { hasError, error } = this.state
    const { fallback, children } = this.props

    if (hasError && error) {
      if (isValidElement(fallback)) {
        return fallback
      }

      const FallbackComponent = fallback as React.ComponentType<{
        error: Error
        resetError: () => void
      }>

      return <FallbackComponent error={error} resetError={this.resetError} />
    }

    return children
  }
}
