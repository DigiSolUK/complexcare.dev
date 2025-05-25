"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export function DatabaseConnectionTester() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState<string>("")
  const [timestamp, setTimestamp] = useState<string>("")

  async function testConnection() {
    setStatus("loading")

    try {
      const response = await fetch("/api/health/database")
      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(data.message)
        setTimestamp(data.timestamp)
      } else {
        setStatus("error")
        setMessage(data.message || "Unknown error")
      }
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Failed to test connection")
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={testConnection} disabled={status === "loading"}>
        {status === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Test Connection
      </Button>

      {status === "success" && (
        <Alert variant="success">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Connection Successful</AlertTitle>
          <AlertDescription>
            {message}
            {timestamp && <div className="text-xs mt-1">Timestamp: {timestamp}</div>}
          </AlertDescription>
        </Alert>
      )}

      {status === "error" && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Connection Failed</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
