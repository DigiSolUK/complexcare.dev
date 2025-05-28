"use client"

import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function PublicModeBanner() {
  return (
    <Alert variant="warning" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Public Mode Active</AlertTitle>
      <AlertDescription>
        The system is running in public mode. All features are accessible without authentication. Data changes will not
        be persisted to the database.
      </AlertDescription>
    </Alert>
  )
}
