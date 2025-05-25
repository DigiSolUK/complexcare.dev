"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function CareProfessionalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Care Professional Error:", error)
  }, [error])

  const handleReset = () => {
    try {
      // Attempt to recover by trying to re-render the segment
      if (reset && typeof reset === "function") {
        reset()
      } else {
        // If reset is not available, reload the page
        window.location.reload()
      }
    } catch (e) {
      // If reset fails, reload the page
      window.location.reload()
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mx-auto max-w-4xl">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">Something went wrong!</h2>
            <p className="text-gray-600 mb-6">
              We encountered an error while loading the care professional details. This could be due to a database
              connection issue or missing data.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={handleReset}>Try Again</Button>
              <Button variant="outline" onClick={() => router.push("/care-professionals")}>
                Return to List
              </Button>
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Go to Dashboard
              </Button>
            </div>
            {process.env.NODE_ENV === "development" && error && (
              <div className="mt-8 p-4 bg-gray-100 rounded-md text-left w-full max-w-2xl">
                <h3 className="font-semibold text-sm text-gray-700 mb-2">Error Details (Development Only)</h3>
                <p className="font-mono text-sm text-red-600">{error.message || "Unknown error"}</p>
                {error.stack && (
                  <pre className="mt-2 text-xs overflow-auto max-h-48 p-2 bg-gray-900 text-gray-200 rounded">
                    {error.stack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
