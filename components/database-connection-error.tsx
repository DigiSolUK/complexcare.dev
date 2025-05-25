"use client"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { useDatabaseConnection } from "./database-provider"

export function DatabaseConnectionError() {
  const { isConnected, isLoading, error, checkConnection } = useDatabaseConnection()

  if (isLoading) {
    return (
      <Alert className="mb-4">
        <RefreshCw className="h-4 w-4 animate-spin" />
        <AlertTitle>Checking database connection...</AlertTitle>
        <AlertDescription>Please wait while we verify the database connection.</AlertDescription>
      </Alert>
    )
  }

  if (!isConnected) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Database Connection Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <p>{error || "Failed to connect to the database. Please try again later."}</p>
          <Button variant="outline" size="sm" className="w-fit" onClick={checkConnection}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Connection
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return null
}
