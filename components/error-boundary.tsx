"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Caught in error boundary:", event.error)
      setHasError(true)
      setError(event.error)
    }

    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <div className="bg-gray-100 p-3 rounded mb-4 overflow-auto max-h-40">
            <pre className="text-sm">{error?.message || "Unknown error"}</pre>
          </div>
          <Button
            onClick={() => {
              setHasError(false)
              setError(null)
              window.location.href = "/"
            }}
            className="w-full"
          >
            Return to Home
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

