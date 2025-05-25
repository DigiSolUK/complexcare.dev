"use client"

import React from "react"

interface ErrorBoundaryProps {
  fallback: React.ComponentType<{ error: Error; resetError: () => void }>
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): React.ReactNode {
    const { fallback: Fallback, children } = this.props
    const { hasError, error } = this.state

    if (hasError && error) {
      return <Fallback error={error} resetError={this.resetError} />
    }

    return children
  }
}
