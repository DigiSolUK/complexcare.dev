"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"

export default function HealthCheckPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function runDiagnostics() {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/diagnostics")
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">System Health Check</CardTitle>
          <CardDescription>Diagnose common issues with the ComplexCare CRM system</CardDescription>
        </CardHeader>

        <CardContent>
          {loading && (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-500">Running diagnostics...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 p-4 rounded-md text-red-800 mb-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span>Error running diagnostics: {error}</span>
              </div>
            </div>
          )}

          {results && !loading && (
            <div className="space-y-6">
              <div
                className={`p-4 rounded-md ${results.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
              >
                <div className="flex items-center">
                  {results.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span className="font-medium">
                    {results.success ? "All systems operational" : "System issues detected"}
                  </span>
                </div>
              </div>

              {results.results &&
                Object.entries(results.results).map(([key, value]: [string, any]) => (
                  <div key={key} className="border rounded-md overflow-hidden">
                    <div
                      className={`px-4 py-3 font-medium ${value.status === "pass" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                    >
                      <div className="flex items-center">
                        {value.status === "pass" ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                        )}
                        <span className="capitalize">{key}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <p>{value.message}</p>
                      {value.details && (
                        <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto">
                          {JSON.stringify(value.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button onClick={runDiagnostics} disabled={loading} className="flex items-center">
            {loading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
            Run Diagnostics Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
