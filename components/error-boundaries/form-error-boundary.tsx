"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { logError } from "@/lib/services/error-logging-service"

interface Props {
  children: ReactNode
  formName?: string
  onReset?: () => void
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class FormErrorBoundary extends Component<Props, State> {
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
      section: `Form: ${this.props.formName || "Unknown Form"}`,
      type: "form-submission-error",
      severity: "error",
    })

    console.error("Error caught by FormErrorBoundary:", error, errorInfo)
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/10 dark:border-orange-900/50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700 dark:text-orange-400">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {this.props.formName ? `Error in ${this.props.formName} Form` : "Form Submission Error"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-700 dark:text-orange-400">
              There was a problem processing your form submission. Please try again or contact support if the issue
              persists.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mt-4 p-2 bg-orange-100 dark:bg-orange-900/20 rounded text-xs font-mono overflow-auto max-h-40">
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
              className="flex items-center text-orange-700 border-orange-300 hover:bg-orange-100 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-900/20"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Reset Form
            </Button>
          </CardFooter>
        </Card>
      )
    }

    return this.props.children
  }
}
