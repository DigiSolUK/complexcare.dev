"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AuthDebugPage() {
  const [isChecking, setIsChecking] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const checkAuth0Config = async () => {
    try {
      setIsChecking(true)
      setError(null)

      // Check if environment variables are set - REMOVED sensitive env var check
      const envCheck = {
        AUTH0_CLIENT_ID: !!process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
        AUTH0_ISSUER_BASE_URL: !!process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL,
        NEXTAUTH_URL: !!process.env.NEXT_PUBLIC_NEXTAUTH_URL,
        // Removed NEXTAUTH_SECRET check from client component
      }

      // Try to fetch the Auth0 configuration
      const response = await fetch("/api/auth/debug")
      const data = await response.json()

      setResults({
        envCheck,
        apiResponse: data,
      })
    } catch (err) {
      console.error("Debug error:", err)
      setError("An error occurred while checking Auth0 configuration")
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-3xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Auth0 Configuration Debug</CardTitle>
          <CardDescription>Use this page to diagnose Auth0 integration issues</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <Button onClick={checkAuth0Config} disabled={isChecking}>
              {isChecking ? "Checking..." : "Check Auth0 Configuration"}
            </Button>

            {results && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Environment Variables:</h3>
                <pre className="text-xs overflow-auto bg-gray-100 p-2 rounded">
                  {JSON.stringify(results.envCheck, null, 2)}
                </pre>

                <h3 className="font-medium mt-4 mb-2">API Response:</h3>
                <pre className="text-xs overflow-auto bg-gray-100 p-2 rounded">
                  {JSON.stringify(results.apiResponse, null, 2)}
                </pre>
              </div>
            )}

            <div className="mt-6 space-y-4">
              <h3 className="font-medium">Auth0 Integration Checklist:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Verify Auth0 application settings in the Auth0 dashboard</li>
                <li>
                  Ensure Allowed Callback URLs includes:{" "}
                  <code>
                    {typeof window !== "undefined"
                      ? `${window.location.origin}/api/auth/callback/auth0`
                      : "[your-domain]/api/auth/callback/auth0"}
                  </code>
                </li>
                <li>
                  Ensure Allowed Logout URLs includes:{" "}
                  <code>{typeof window !== "undefined" ? window.location.origin : "[your-domain]"}</code>
                </li>
                <li>
                  Ensure Allowed Web Origins includes:{" "}
                  <code>{typeof window !== "undefined" ? window.location.origin : "[your-domain]"}</code>
                </li>
                <li>Check that all required environment variables are set in your Vercel project</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

