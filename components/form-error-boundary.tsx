"use client"

import type React from "react"

import { ErrorBoundary } from "./error-boundary"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface FormErrorFallbackProps {
  error: Error
  resetError: () => void
}

function FormErrorFallback({ error, resetError }: FormErrorFallbackProps) {
  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-700">
          <AlertTriangle className="h-5 w-5" />
          Form Error
        </CardTitle>
        <CardDescription className="text-yellow-600">
          There was an error with the form. Please try again.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{error.message}</p>
      </CardContent>
      <CardContent className="pt-0">
        <Button onClick={resetError} variant="outline" className="w-full">
          Reset Form
        </Button>
      </CardContent>
    </Card>
  )
}

export function FormErrorBoundary({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary fallback={FormErrorFallback}>{children}</ErrorBoundary>
}
