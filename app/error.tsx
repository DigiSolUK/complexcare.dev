"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import { logErrorWithSourceMap } from "@/lib/error-tracking"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Log the error with enhanced context
    logErrorWithSourceMap(error, {
      location: window.location.pathname,
      component: "AppErrorBoundary",
      action: "render",
      severity: "high",
      url: window.location.href,
      digest: error.digest,
      additionalInfo: {
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      },
    })
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900">Something went wrong</h2>
              <p className="text-gray-600">
                We encountered an unexpected error. Our team has been notified and is working on a fix.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={() => router.push("/")} variant="outline" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Button>

              <Button onClick={reset} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>

            {process.env.NODE_ENV === "development" && error.message && (
              <div className="mt-4 p-3 bg-gray-100 rounded text-left w-full">
                <p className="text-xs font-mono text-gray-700 break-all">{error.message}</p>
                {error.digest && <p className="text-xs text-gray-500 mt-1">Error ID: {error.digest}</p>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
