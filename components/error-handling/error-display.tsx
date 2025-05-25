"use client"
import { AlertTriangle, AlertCircle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ErrorDisplayProps {
  title?: string
  message?: string
  error?: Error
  retry?: () => void
  showHome?: boolean
  showDetails?: boolean
  severity?: "error" | "warning"
}

/**
 * Consistent error display component
 */
export function ErrorDisplay({
  title = "Something went wrong!",
  message = "We apologize for the inconvenience. Please try again or contact support if the problem persists.",
  error,
  retry,
  showHome = true,
  showDetails = process.env.NODE_ENV !== "production",
  severity = "error",
}: ErrorDisplayProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {severity === "error" ? (
            <AlertCircle className="h-6 w-6 text-red-500" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-amber-500" />
          )}
          <CardTitle className={severity === "error" ? "text-red-600" : "text-amber-600"}>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{message}</p>

        {showDetails && error && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md overflow-auto max-h-48 text-sm font-mono">
            <p className="text-gray-800">
              {error.name}: {error.message}
            </p>
            {error.stack && (
              <pre className="text-xs text-gray-600 mt-2 whitespace-pre-wrap">
                {error.stack.split("\n").slice(1).join("\n")}
              </pre>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-3">
          {retry && (
            <Button
              onClick={retry}
              variant="default"
              className={severity === "error" ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700"}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}

          {showHome && (
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className={severity === "error" ? "text-red-600 border-red-200" : "text-amber-600 border-amber-200"}
            >
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
