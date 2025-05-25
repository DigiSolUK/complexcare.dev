"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, ArrowRight, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function EmergencyRecoveryPage() {
  const [diagnostics, setDiagnostics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function runDiagnostics() {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/emergency-recovery")
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      setDiagnostics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  function getStatusIcon(status: string) {
    if (status === "success") return <CheckCircle className="h-5 w-5 text-green-500" />
    if (status === "error") return <XCircle className="h-5 w-5 text-red-500" />
    return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">ComplexCare CRM Emergency Recovery</CardTitle>
            <CardDescription>This page helps diagnose and recover from critical system failures</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 border-amber-500 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertTitle>Emergency Mode Active</AlertTitle>
              <AlertDescription>
                The system is running in emergency recovery mode with reduced functionality.
              </AlertDescription>
            </Alert>

            {error && (
              <Alert className="mb-4 border-red-500 bg-red-50">
                <XCircle className="h-4 w-4 text-red-500" />
                <AlertTitle>Diagnostics Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-medium">System Diagnostics</h3>

              {loading && (
                <p className="text-gray-500 flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Running diagnostics...
                </p>
              )}

              {diagnostics && (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    {Object.entries(diagnostics.checks).map(([key, value]: [string, any]) => (
                      <div key={key} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium capitalize">{key} Check</h4>
                          {getStatusIcon(value.status)}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{value.message}</p>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-lg font-medium mt-6">Recovery Actions</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {Object.entries(diagnostics.fixes).map(([key, value]: [string, any]) => (
                      <div key={key} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium capitalize">{key} Fix</h4>
                          {getStatusIcon(value.status)}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{value.message}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <Button onClick={runDiagnostics} className="mb-4" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Run Diagnostics Again
            </Button>

            {diagnostics?.recoveryLinks && (
              <div className="w-full">
                <h3 className="text-lg font-medium mb-2">Recovery Links</h3>
                <div className="grid gap-2">
                  {diagnostics.recoveryLinks.map((link: any, index: number) => (
                    <Link
                      href={`${link.path}${link.path.includes("?") ? "&" : "?"}safe_mode=1`}
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technical Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60">
              <pre className="text-xs">{JSON.stringify(diagnostics, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
