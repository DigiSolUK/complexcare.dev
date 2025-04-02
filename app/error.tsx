"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
        <p className="mb-6 text-gray-600">
          We apologize for the inconvenience. Please try again or contact support if the problem persists.
        </p>
        <div className="space-y-4">
          <Button onClick={reset} variant="destructive">
            Try Again
          </Button>
          <div>
            <a href="/" className="inline-block text-sm text-blue-600 hover:underline">
              Return Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

