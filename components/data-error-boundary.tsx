"use client"

import type React from "react"

import { Component, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface DataErrorBoundaryProps {
  children: ReactNode
  onRetry?: () => void
  fallback?: ReactNode
}

interface DataErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class DataErrorBoundary extends Component<DataErrorBoundaryProps, DataErrorBoundaryState> {
  constructor(props: DataErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): DataErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("DataErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <CardTitle>Error Loading Data</CardTitle>
            </div>
            <CardDescription>
              There was a problem loading the data. This could be due to a network issue or a server problem.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p>Error details: {this.state.error?.message || "Unknown error"}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                if (this.props.onRetry) {
                  this.props.onRetry()
                }
              }}
            >
              Try Again
            </Button>
          </CardFooter>
        </Card>
      )
    }

    return this.props.children
  }
}
