"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { logError } from "@/lib/services/error-logging-service"

interface Props {
  children: ReactNode
  section?: string
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class SectionErrorBoundary extends Component<Props, State> {
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
      section: this.props.section || "Unknown Section",
      type: "react-error-boundary",
      severity: "error",
    })

    console.error("Error caught by SectionErrorBoundary:", error, errorInfo)
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-900/50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-700 dark:text-red-400">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {this.props.section ? `${this.props.section} Error` : "Component Error"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-700 dark:text-red-400">
              Something went wrong in this section. Our team has been notified.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mt-4 p-2 bg-red-100 dark:bg-red-900/20 rounded text-xs font-mono overflow-auto max-h-40">
                <p className="font-semibold">{this.state.error.toString()}</p>
                {this.state.errorInfo && <pre className="mt-2 text-xs">{this.state.errorInfo.componentStack}</pre>}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={this.handleReset}
              className="flex items-center text-red-700 border-red-300 hover:bg-red-100 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardFooter>
        </Card>
      )
    }

    return this.props.children
  }
}
