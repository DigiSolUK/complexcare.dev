"use client"

import type React from "react"
import { ErrorBoundary } from "../error-boundary"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface SectionErrorFallbackProps {
  error: Error
  resetError: () => void
}

function SectionErrorFallback({ error, resetError }: SectionErrorFallbackProps) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Section Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>{error.message || "An error occurred in this section"}</p>
        <Button onClick={resetError} size="sm" variant="outline" className="w-fit gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  )
}

export function SectionErrorBoundary({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary fallback={SectionErrorFallback}>{children}</ErrorBoundary>
}
