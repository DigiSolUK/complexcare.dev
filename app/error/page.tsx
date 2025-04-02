"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ErrorPage() {
  const [errorDetails, setErrorDetails] = useState<string | null>(null)

  useEffect(() => {
    // Get error details from URL if available
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get("error")
    if (error) {
      try {
        setErrorDetails(decodeURIComponent(error))
      } catch (e) {
        setErrorDetails(error)
      }
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-red-600 mb-2">Something went wrong</h1>
          <p className="text-gray-600 mb-6">
            We apologize for the inconvenience. Please try again or contact support if the problem persists.
          </p>

          {errorDetails && (
            <div className="bg-gray-100 p-4 rounded-md mb-6 text-left overflow-auto max-h-40">
              <pre className="text-sm text-gray-800">{errorDetails}</pre>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
              Try Again
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

