"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { formatErrorWithSource } from "@/lib/error-tracking"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SourceMappedErrorProps {
  error: Error
  componentStack?: string
  errorInfo?: React.ErrorInfo
  resetError?: () => void
}

export function SourceMappedError({ error, componentStack, errorInfo, resetError }: SourceMappedErrorProps) {
  const [formattedError, setFormattedError] = useState<string>("")

  useEffect(() => {
    // Format the error with source map information
    setFormattedError(formatErrorWithSource(error))
  }, [error])

  return (
    <Card className="w-full max-w-4xl mx-auto my-8 border-red-200 shadow-lg">
      <CardHeader className="bg-red-50">
        <CardTitle className="text-red-700">Application Error</CardTitle>
        <CardDescription className="text-red-600">An error occurred in the application</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>{error.name}</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>

        <Tabs defaultValue="source">
          <TabsList>
            <TabsTrigger value="source">Source Location</TabsTrigger>
            <TabsTrigger value="stack">Stack Trace</TabsTrigger>
            {componentStack && <TabsTrigger value="component">Component Stack</TabsTrigger>}
          </TabsList>

          <TabsContent value="source" className="mt-4">
            <div className="bg-slate-800 text-white p-4 rounded-md">
              <pre className="whitespace-pre-wrap">{formattedError}</pre>
            </div>
          </TabsContent>

          <TabsContent value="stack" className="mt-4">
            <ScrollArea className="h-[300px]">
              <div className="bg-slate-800 text-white p-4 rounded-md">
                <pre className="whitespace-pre-wrap">{error.stack}</pre>
              </div>
            </ScrollArea>
          </TabsContent>

          {componentStack && (
            <TabsContent value="component" className="mt-4">
              <ScrollArea className="h-[300px]">
                <div className="bg-slate-800 text-white p-4 rounded-md">
                  <pre className="whitespace-pre-wrap">{componentStack}</pre>
                </div>
              </ScrollArea>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Return Home
        </Button>
        {resetError && <Button onClick={resetError}>Try Again</Button>}
      </CardFooter>
    </Card>
  )
}
