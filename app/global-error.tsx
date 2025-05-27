"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console in production
    console.error("Global error:", error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>

            <h1 className="text-2xl font-bold">Critical Error</h1>
            <p className="text-gray-600 max-w-md">
              A critical error occurred. Please refresh the page or contact support if the problem persists.
            </p>

            <div className="flex gap-3 justify-center pt-4">
              <Button onClick={reset}>Try Again</Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </div>

            {error.digest && <p className="text-xs text-gray-500 mt-4">Error ID: {error.digest}</p>}
          </div>
        </div>
      </body>
    </html>
  )
}
