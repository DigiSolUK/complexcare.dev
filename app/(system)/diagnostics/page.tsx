"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Wrench,
  Database,
  Server,
  Shield,
  Cloud,
  Brain,
  Settings,
} from "lucide-react"

interface HealthCheckResult {
  service: string
  status: "healthy" | "unhealthy" | "degraded"
  message: string
  details?: any
  error?: string
}

interface SystemHealth {
  status: string
  timestamp: string
  services: HealthCheckResult[]
  summary: {
    total: number
    healthy: number
    degraded: number
    unhealthy: number
  }
}

export default function DiagnosticsPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [fixing, setFixing] = useState(false)
  const [fixResults, setFixResults] = useState<any[]>([])

  const fetchHealth = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/diagnostics/system-health")
      const data = await response.json()
      setHealth(data)
    } catch (error) {
      console.error("Failed to fetch system health:", error)
    } finally {
      setLoading(false)
    }
  }

  const runFixes = async () => {
    setFixing(true)
    try {
      const response = await fetch("/api/diagnostics/fix-issues", {
        method: "POST",
      })
      const data = await response.json()
      setFixResults(data.fixes || [])
      // Refresh health check after fixes
      await fetchHealth()
    } catch (error) {
      console.error("Failed to run fixes:", error)
    } finally {
      setFixing(false)
    }
  }

  useEffect(() => {
    fetchHealth()
  }, [])

  const getServiceIcon = (service: string) => {
    switch (service) {
      case "Database":
        return <Database className="h-5 w-5" />
      case "Redis":
        return <Server className="h-5 w-5" />
      case "Authentication":
        return <Shield className="h-5 w-5" />
      case "Blob Storage":
        return <Cloud className="h-5 w-5" />
      case "Groq AI":
        return <Brain className="h-5 w-5" />
      case "Environment Variables":
        return <Settings className="h-5 w-5" />
      default:
        return <Server className="h-5 w-5" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "degraded":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "unhealthy":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-green-500">Healthy</Badge>
      case "degraded":
        return <Badge className="bg-yellow-500">Degraded</Badge>
      case "unhealthy":
        return <Badge className="bg-red-500">Unhealthy</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">System Diagnostics</h1>
        <p className="text-muted-foreground">Monitor and troubleshoot system health</p>
      </div>

      {/* Overall Status */}
      {health && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle>System Status</CardTitle>
                {getStatusBadge(health.status)}
              </div>
              <div className="flex gap-2">
                <Button onClick={fetchHealth} disabled={loading} size="sm">
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button onClick={runFixes} disabled={fixing} variant="outline" size="sm">
                  <Wrench className={`h-4 w-4 mr-2 ${fixing ? "animate-spin" : ""}`} />
                  Run Fixes
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{health.summary.total}</div>
                <div className="text-sm text-muted-foreground">Total Services</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{health.summary.healthy}</div>
                <div className="text-sm text-muted-foreground">Healthy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">{health.summary.degraded}</div>
                <div className="text-sm text-muted-foreground">Degraded</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{health.summary.unhealthy}</div>
                <div className="text-sm text-muted-foreground">Unhealthy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="fixes">Fix Results</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading system health...</span>
                </div>
              </CardContent>
            </Card>
          ) : health ? (
            health.services.map((service) => (
              <Card key={service.service}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getServiceIcon(service.service)}
                      <CardTitle className="text-lg">{service.service}</CardTitle>
                    </div>
                    {getStatusIcon(service.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">{service.message}</p>
                  {service.error && (
                    <Alert variant="destructive" className="mb-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{service.error}</AlertDescription>
                    </Alert>
                  )}
                  {service.details && (
                    <div className="bg-muted p-3 rounded-md">
                      <pre className="text-xs overflow-auto">{JSON.stringify(service.details, null, 2)}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Data</AlertTitle>
              <AlertDescription>Unable to fetch system health data</AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="fixes" className="space-y-4">
          {fixResults.length > 0 ? (
            fixResults.map((fix, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{fix.issue}</CardTitle>
                    <Badge
                      variant={
                        fix.status === "fixed" ? "default" : fix.status === "failed" ? "destructive" : "secondary"
                      }
                    >
                      {fix.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{fix.message}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Fixes Run</AlertTitle>
              <AlertDescription>Click "Run Fixes" to attempt automatic issue resolution</AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {health?.services
                .filter((s) => s.status !== "healthy")
                .map((service) => (
                  <Alert key={service.service}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{service.service}</AlertTitle>
                    <AlertDescription>
                      {service.service === "Environment Variables" && service.details?.missing?.length > 0 && (
                        <div>
                          <p>Missing environment variables:</p>
                          <ul className="list-disc list-inside mt-2">
                            {service.details.missing.map((varName: string) => (
                              <li key={varName}>{varName}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {service.service === "Database" && (
                        <p>Ensure DATABASE_URL is properly configured with your Neon connection string</p>
                      )}
                      {service.service === "Redis" && (
                        <p>Verify KV_URL and KV_REST_API_TOKEN are set from your Upstash integration</p>
                      )}
                      {service.service === "Authentication" && (
                        <p>Check NEXTAUTH_URL and NEXTAUTH_SECRET configuration</p>
                      )}
                    </AlertDescription>
                  </Alert>
                ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
