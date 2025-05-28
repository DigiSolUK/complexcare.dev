"use client"

import type React from "react"

import { ErrorBoundary } from "../error-boundary"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface DataFetchErrorFallbackProps {
  error: Error
  resetError: () => void
}

function DataFetchErrorFallback({ error, resetError }: DataFetchErrorFallbackProps) {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700 text-lg">
          <AlertTriangle className="h-4 w-4" />
          Data Loading Error
        </CardTitle>
        <CardDescription className="text-blue-600">Failed to load data</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{error.message || "An error occurred while fetching data"}</p>
        <Button onClick={resetError} size="sm" variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </CardContent>
    </Card>
  )
}

export function DataFetchErrorBoundary({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary fallback={DataFetchErrorFallback}>{children}</ErrorBoundary>
}
