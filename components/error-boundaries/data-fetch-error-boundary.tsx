"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { logError } from "@/lib/services/error-logging-service"

interface Props {
  children: ReactNode
  resourceName?: string
  onRetry?: () => void
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class DataFetchErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo })

    // Log the error to our error logging service
    logError({
      message: error.message,
      stack: error.stack || "",
      componentStack: errorInfo.componentStack,
      section: `Data Fetch: ${this.props.resourceName || "Unknown Resource"}`,
      type: "data-fetch-error",
      severity: "error",
    })

    console.error("Error caught by DataFetchErrorBoundary:", error, errorInfo)
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    if (this.props.onRetry) {
      this.props.onRetry()
    }
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/10 dark:border-amber-900/50">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {this.props.resourceName ? `Failed to load ${this.props.resourceName}` : "Data Loading Error"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              We couldn't load the requested data. This could be due to a network issue or the server might be
              temporarily unavailable.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mt-4 p-2 bg-amber-100 dark:bg-amber-900/20 rounded text-xs font-mono overflow-auto max-h-40">
                <p className="font-semibold">{this.state.error.toString()}</p>
                {this.state.errorInfo && <pre className="mt-2 text-xs">{this.state.errorInfo.componentStack}</pre>}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={this.handleRetry}
              className="flex items-center text-amber-700 border-amber-300 hover:bg-amber-100 dark:text-amber-400 dark:border-amber-800 dark:hover:bg-amber-900/20"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardFooter>
        </Card>
      )
    }

    return this.props.children
  }
}
