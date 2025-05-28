"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function DatabaseConnectionCheck() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isChecking, setIsChecking] = useState(true)

  const checkConnection = async () => {
    setIsChecking(true)
    setStatus("loading")

    try {
      const response = await fetch("/api/health/database")
      const data = await response.json()

      if (response.ok && data.success) {
        setStatus("connected")
      } else {
        setStatus("error")
        setErrorMessage(data.message || "Unknown database error")
      }
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to check database connection")
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Database Connection
          {status === "connected" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
          {status === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
          {status === "loading" && (
            <svg
              className="animate-spin h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
        </CardTitle>
        <CardDescription>
          {status === "connected" && "Successfully connected to NeonDB"}
          {status === "error" && "Failed to connect to database"}
          {status === "loading" && "Checking database connection..."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === "error" && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
            <h3 className="text-sm font-semibold">Connection Error</h3>
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}

        <Button
          onClick={checkConnection}
          disabled={isChecking}
          variant={status === "error" ? "destructive" : "default"}
          className="w-full"
        >
          {isChecking ? "Checking..." : "Check Connection"}
        </Button>
      </CardContent>
    </Card>
  )
}
