"use client"

import type React from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ErrorBoundary } from "@/components/error-boundary"

interface SectionErrorFallbackProps {
  error: Error
  resetError: () => void
}

function SectionErrorFallback({ error, resetError }: SectionErrorFallbackProps) {
  return (
    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/10 dark:border-amber-900/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-amber-700 dark:text-amber-400 text-base">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Section Error
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-amber-700 dark:text-amber-400 mb-3">
          {error.message || "An error occurred in this section"}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={resetError}
          className="flex items-center text-amber-700 border-amber-300 hover:bg-amber-100 dark:text-amber-400 dark:border-amber-800 dark:hover:bg-amber-900/20"
        >
          <RefreshCw className="h-3 w-3 mr-2" />
          Retry
        </Button>
      </CardContent>
    </Card>
  )
}

export function SectionErrorBoundary({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary fallback={SectionErrorFallback}>{children}</ErrorBoundary>
}
