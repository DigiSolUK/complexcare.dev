"use client"

import { useState } from "react"
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp, Bug, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { getUserFriendlyErrorMessage } from "@/lib/error-tracking"

interface SourceMappedErrorProps {
  error: Error & { digest?: string }
  resetError?: () => void
  showReset?: boolean
  showStack?: boolean
  showReport?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  severity?: "low" | "medium" | "high" | "critical"
}

export function SourceMappedError({
  error,
  resetError,
  showReset = true,
  showStack = true,
  showReport = true,
  variant = "default",
  severity = "medium",
}: SourceMappedErrorProps) {
  const [isStackVisible, setIsStackVisible] = useState(false)
  const [isReporting, setIsReporting] = useState(false)
  const [isReported, setIsReported] = useState(false)

  // Get user-friendly error message
  const friendlyMessage = getUserFriendlyErrorMessage(error)

  // Extract source information from stack trace if available
  const sourceInfo = extractSourceInfo(error.stack || "")

  // Determine severity color
  const severityColor = {
    low: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    medium: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    critical: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  }[severity]

  // Format stack trace for better readability
  const formattedStack = formatStackTrace(error.stack || "")

  // Handle reporting the error
  const handleReportError = async () => {
    setIsReporting(true)

    try {
      // In a real app, you would send this to your error reporting service
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsReported(true)
      console.log("Error reported:", {
        error: error.message,
        stack: error.stack,
        digest: error.digest,
        location: sourceInfo,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      })
    } catch (reportError) {
      console.error("Failed to report error:", reportError)
    } finally {
      setIsReporting(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg border-red-200 dark:border-red-800">
      <CardHeader className="bg-red-50 dark:bg-red-900/30 border-b border-red-100 dark:border-red-800">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <CardTitle className="text-red-700 dark:text-red-300">An error occurred</CardTitle>
        </div>
        <CardDescription className="text-red-600 dark:text-red-400">
          {error.digest && <span className="font-mono text-xs">Error ID: {error.digest}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 pb-4">
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>

        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">User-friendly message:</h3>
            <p className="mt-1 text-sm">{friendlyMessage}</p>
          </div>

          {sourceInfo.file && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Error location:</h3>
              <div className="mt-1 font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">
                {sourceInfo.file}:{sourceInfo.line}:{sourceInfo.column}
                {sourceInfo.functionName && <span> in {sourceInfo.functionName}()</span>}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={severityColor}>
              {severity.toUpperCase()} Severity
            </Badge>
            {error.digest && (
              <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                Digest: {error.digest.substring(0, 8)}
              </Badge>
            )}
            <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {new Date().toLocaleString()}
            </Badge>
          </div>
        </div>

        {showStack && (
          <Collapsible open={isStackVisible} onOpenChange={setIsStackVisible} className="mt-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Stack trace</h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  {isStackVisible ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  <span className="sr-only">Toggle stack trace</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
              <div className="rounded-md bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto">
                <pre className="text-xs font-mono whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200">
                  {formattedStack}
                </pre>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t border-red-100 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10 px-6 py-4">
        {showReset && resetError && (
          <Button variant="outline" onClick={resetError} className="gap-1">
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
        )}

        {showReport && (
          <Button
            variant="secondary"
            onClick={handleReportError}
            disabled={isReporting || isReported}
            className="gap-1"
          >
            <Bug className="h-4 w-4" />
            {isReporting ? "Reporting..." : isReported ? "Reported" : "Report issue"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

// Helper function to extract source information from stack trace
function extractSourceInfo(stack: string): { file?: string; line?: string; column?: string; functionName?: string } {
  const result = { file: undefined, line: undefined, column: undefined, functionName: undefined }

  const stackLines = stack.split("\n")

  for (const line of stackLines) {
    if (line.includes("/app/") || line.includes("/components/") || line.includes("/lib/")) {
      const functionMatch = line.match(/at\s+([^\s]+)\s+$$([^:]+):(\d+):(\d+)$$/)
      if (functionMatch) {
        result.functionName = functionMatch[1]
        result.file = functionMatch[2]
        result.line = functionMatch[3]
        result.column = functionMatch[4]
        break
      }

      const fileMatch = line.match(/at\s+([^:]+):(\d+):(\d+)/)
      if (fileMatch) {
        result.file = fileMatch[1]
        result.line = fileMatch[2]
        result.column = fileMatch[3]
        break
      }
    }
  }

  return result
}

// Helper function to format stack trace for better readability
function formatStackTrace(stack: string): string {
  if (!stack) return "No stack trace available"

  // Split the stack into lines
  const lines = stack.split("\n")

  // Format each line
  return lines
    .map((line, index) => {
      // Highlight app code
      if (line.includes("/app/") || line.includes("/components/") || line.includes("/lib/")) {
        return `→ ${line}`
      }
      return line
    })
    .join("\n")
}
