"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface DataErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onRetry?: () => void
}

interface DataErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class DataErrorBoundaryClass extends React.Component<DataErrorBoundaryProps, DataErrorBoundaryState> {
  constructor(props: DataErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Data fetching error:", error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    if (this.props.onRetry) {
      this.props.onRetry()
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="w-full my-4">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center p-4">
              <AlertTriangle className="h-10 w-10 text-yellow-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Data Loading Error</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {this.state.error?.message || "Failed to load data. Please try again."}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={this.handleRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardFooter>
        </Card>
      )
    }

    return this.props.children
  }
}

export function DataErrorBoundary(props: DataErrorBoundaryProps) {
  const [key, setKey] = useState(0)

  const handleRetry = () => {
    setKey((prev) => prev + 1)
    if (props.onRetry) {
      props.onRetry()
    }
  }

  return <DataErrorBoundaryClass key={key} {...props} onRetry={handleRetry} />
}
