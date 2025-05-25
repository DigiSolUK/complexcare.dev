"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Database, Server, FileText, Cog } from "lucide-react"

export default function DiagnosticsPage() {
  const [healthData, setHealthData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fixResults, setFixResults] = useState<any>(null)
  const [fixLoading, setFixLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("services")

  useEffect(() => {
    fetchHealthData()
  }, [])

  const fetchHealthData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/diagnostics/system-health")
      const data = await response.json()

      setHealthData(data)
    } catch (err) {
      setError("Failed to fetch system health data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const runFixes = async () => {
    setFixLoading(true)
    setFixResults(null)

    try {
      // Fix database issues
      const dbResponse = await fetch("/api/diagnostics/fix-database", {
        method: "POST",
      })
      const dbData = await dbResponse.json()

      // Get import fix instructions
      const importResponse = await fetch("/api/diagnostics/fix-imports", {
        method: "POST",
      })
      const importData = await importResponse.json()

      setFixResults({
        database: dbData,
        imports: importData,
      })

      // Refresh health data after fixes
      fetchHealthData()
    } catch (err) {
      setError("Failed to run fixes")
      console.error(err)
    } finally {
      setFixLoading(false)
      setActiveTab("fixes")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800 border-green-200"
      case "degraded":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "unhealthy":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "degraded":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "unhealthy":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />
    }
  }

  const getServiceIcon = (service: string) => {
    switch (service) {
      case "database":
        return <Database className="h-5 w-5" />
      case "redis":
        return <Server className="h-5 w-5" />
      case "blob":
        return <FileText className="h-5 w-5" />
      case "groq":
        return <Cog className="h-5 w-5" />
      default:
        return <Server className="h-5 w-5" />
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">System Diagnostics</h1>
          <p className="text-muted-foreground">Check and fix system health issues</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchHealthData} variant="outline" disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={runFixes} disabled={fixLoading}>
            {fixLoading ? "Running Fixes..." : "Run Fixes"}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <p>Loading system health data...</p>
          </div>
        </div>
      ) : (
        <>
          {healthData && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>System Status</CardTitle>
                  <Badge className={getStatusColor(healthData.status)}>{healthData.status.toUpperCase()}</Badge>
                </div>
                <CardDescription>Overall health status of your ComplexCare CRM system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {healthData.services &&
                    Object.entries(healthData.services).map(([service, data]: [string, any]) => (
                      <Card key={service} className={`border ${data.status === "unhealthy" ? "border-red-300" : ""}`}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              {getServiceIcon(service)}
                              <CardTitle className="text-base capitalize">{service}</CardTitle>
                            </div>
                            {getStatusIcon(data.status)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{data.message}</p>
                          {data.details &&
                            Object.entries(data.details).map(([key, value]: [string, any]) => (
                              <div key={key} className="mt-2 text-xs text-muted-foreground">
                                <span className="font-medium capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}:{" "}
                                </span>
                                <span>{String(value)}</span>
                              </div>
                            ))}
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="fixes">Fix Results</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle>Service Details</CardTitle>
                  <CardDescription>Detailed information about each service in your system</CardDescription>
                </CardHeader>
                <CardContent>
                  {healthData && healthData.services ? (
                    <div className="space-y-6">
                      {Object.entries(healthData.services).map(([service, data]: [string, any]) => (
                        <div key={service} className="border-b pb-4 last:border-0">
                          <h3 className="text-lg font-medium capitalize mb-2 flex items-center gap-2">
                            {getServiceIcon(service)}
                            {service}
                            <Badge className={getStatusColor(data.status)}>{data.status}</Badge>
                          </h3>
                          <p className="mb-2">{data.message}</p>

                          {data.details && (
                            <div className="bg-muted p-3 rounded-md mt-2">
                              <h4 className="text-sm font-medium mb-1">Details</h4>
                              <div className="space-y-1">
                                {Object.entries(data.details).map(([key, value]: [string, any]) => (
                                  <div key={key} className="text-sm">
                                    <span className="font-medium capitalize">
                                      {key.replace(/([A-Z])/g, " $1").trim()}:{" "}
                                    </span>
                                    <span className="text-muted-foreground">{String(value)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No service details available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fixes">
              <Card>
                <CardHeader>
                  <CardTitle>Fix Results</CardTitle>
                  <CardDescription>Results of automatic fixes applied to your system</CardDescription>
                </CardHeader>
                <CardContent>
                  {fixResults ? (
                    <div className="space-y-6">
                      <div className="border-b pb-4">
                        <h3 className="text-lg font-medium mb-2">Database Fixes</h3>
                        {fixResults.database.success ? (
                          <div className="bg-green-50 p-3 rounded-md border border-green-200 mb-4">
                            <div className="flex items-center gap-2 text-green-700 mb-2">
                              <CheckCircle className="h-5 w-5" />
                              <span className="font-medium">Database fixes applied successfully</span>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-red-50 p-3 rounded-md border border-red-200 mb-4">
                            <div className="flex items-center gap-2 text-red-700 mb-2">
                              <XCircle className="h-5 w-5" />
                              <span className="font-medium">Database fixes failed</span>
                            </div>
                            <p className="text-red-700">{fixResults.database.error}</p>
                          </div>
                        )}

                        {fixResults.database.results && (
                          <div className="bg-muted p-3 rounded-md mt-2">
                            <h4 className="text-sm font-medium mb-1">Details</h4>
                            <div className="space-y-1">
                              {Object.entries(fixResults.database.results).map(([key, value]: [string, any]) => (
                                <div key={key} className="text-sm">
                                  <span className="font-medium capitalize">
                                    {key.replace(/([A-Z])/g, " $1").trim()}:{" "}
                                  </span>
                                  <span className="text-muted-foreground">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Import Fixes</h3>
                        {fixResults.imports.success ? (
                          <div className="bg-blue-50 p-3 rounded-md border border-blue-200 mb-4">
                            <div className="flex items-center gap-2 text-blue-700 mb-2">
                              <AlertTriangle className="h-5 w-5" />
                              <span className="font-medium">Manual changes required</span>
                            </div>
                            <p className="text-blue-700 mb-2">
                              The following changes need to be made manually to fix import issues:
                            </p>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-blue-800">
                              {fixResults.imports.instructions.map((instruction: string, index: number) => (
                                <li key={index}>{instruction}</li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="bg-red-50 p-3 rounded-md border border-red-200">
                            <div className="flex items-center gap-2 text-red-700 mb-2">
                              <XCircle className="h-5 w-5" />
                              <span className="font-medium">Import fixes failed</span>
                            </div>
                            <p className="text-red-700">{fixResults.imports.error}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p>No fix results available. Click "Run Fixes" to attempt automatic repairs.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations">
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>Suggested actions to resolve system issues</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert className="border-blue-200 bg-blue-50">
                      <AlertTitle className="text-blue-800">Environment Variables</AlertTitle>
                      <AlertDescription className="text-blue-700">
                        <p className="mb-2">
                          Ensure all required environment variables are set in your Vercel project:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>DATABASE_URL or production_DATABASE_URL</li>
                          <li>KV_URL and KV_REST_API_TOKEN (for Redis)</li>
                          <li>BLOB_READ_WRITE_TOKEN (for Blob storage)</li>
                          <li>GROQ_API_KEY (for Groq AI)</li>
                          <li>NEXTAUTH_URL and NEXTAUTH_SECRET</li>
                        </ul>
                      </AlertDescription>
                    </Alert>

                    <Alert className="border-amber-200 bg-amber-50">
                      <AlertTitle className="text-amber-800">Client-Side Environment Access</AlertTitle>
                      <AlertDescription className="text-amber-700">
                        <p className="mb-2">Fix client-side environment variable access:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            Use the new <code>env-safe.ts</code> utility for accessing environment variables
                          </li>
                          <li>Move environment variable access to Server Components or API routes</li>
                          <li>For client-side access, prefix variables with NEXT_PUBLIC_</li>
                        </ul>
                      </AlertDescription>
                    </Alert>

                    <Alert className="border-purple-200 bg-purple-50">
                      <AlertTitle className="text-purple-800">Module Import Paths</AlertTitle>
                      <AlertDescription className="text-purple-700">
                        <p className="mb-2">Update import paths in your code:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            Change <code>@v0/lib/data</code> to <code>@/lib/db</code>
                          </li>
                          <li>
                            Change <code>@v0/components</code> to <code>@/components</code>
                          </li>
                          <li>
                            Change <code>@v0/utils</code> to <code>@/lib/utils</code>
                          </li>
                          <li>See the "Fix Results" tab for a complete list</li>
                        </ul>
                      </AlertDescription>
                    </Alert>

                    <Alert className="border-green-200 bg-green-50">
                      <AlertTitle className="text-green-800">Database Schema</AlertTitle>
                      <AlertDescription className="text-green-700">
                        <p className="mb-2">Ensure database schema is up to date:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Run the "Fix Database" function to add missing columns and indexes</li>
                          <li>Check for any broken foreign key relationships</li>
                          <li>Verify that all required tables exist</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={runFixes} disabled={fixLoading}>
                    {fixLoading ? "Running Fixes..." : "Run Automatic Fixes"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
