"use client"

import type React from "react"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorBoundary } from "@/components/error-boundary"
import Link from "next/link"

interface PageErrorFallbackProps {
  error: Error
  resetError: () => void
}

function PageErrorFallback({ error, resetError }: PageErrorFallbackProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Page Error
          </CardTitle>
          <CardDescription>We encountered an error while loading this page</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">{error.message || "An unexpected error occurred"}</p>
          {process.env.NODE_ENV === "development" && (
            <div className="p-2 bg-gray-100 rounded text-xs font-mono overflow-auto max-h-40">{error.stack}</div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetError} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button asChild>
            <Link href="/dashboard" className="gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export function PageErrorBoundary({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary fallback={PageErrorFallback}>{children}</ErrorBoundary>
}
