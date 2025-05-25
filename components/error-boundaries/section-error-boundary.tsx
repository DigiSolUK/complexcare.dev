"use client"

import type React from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface SectionErrorFallbackProps {
  error: Error
  resetError: () => void
}

function SectionErrorFallback({ error, resetError }: SectionErrorFallbackProps) {
  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-700 text-lg">
          <AlertTriangle className="h-4 w-4" />
          Section Error
        </CardTitle>
        <CardDescription className="text-orange-600">This section encountered an error</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{error.message}</p>
        <Button onClick={resetError} size="sm" variant="outline">
          Reload Section
        </Button>
      </CardContent>
    </Card>
  )
}

export function SectionErrorBoundary({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary fallback={SectionErrorFallback}>{children}</ErrorBoundary>
}
