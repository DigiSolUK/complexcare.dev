"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertTriangle,
  AlertCircle,
  Info,
  ArrowLeft,
  CheckCircle2,
  Clock,
  User,
  Globe,
  Layers,
  XCircle,
} from "lucide-react"
import type { ErrorLog } from "@/lib/services/error-logs-service"
import { format } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ErrorLogDetailClientProps {
  id: string
}

export function ErrorLogDetailClient({ id }: ErrorLogDetailClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [errorLog, setErrorLog] = useState<ErrorLog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchErrorLog = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/error-logs/${id}`)

        if (response.ok) {
          const data = await response.json()
          setErrorLog(data)
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch error log details",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching error log:", error)
        toast({
          title: "Error",
          description: "An error occurred while fetching error log details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchErrorLog()
  }, [id])

  const handleResolveError = async () => {
    try {
      const response = await fetch(`/api/admin/error-logs/${id}/resolve`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Error marked as resolved",
        })

        // Update the local state
        if (errorLog) {
          setErrorLog({
            ...errorLog,
            resolved: true,
          })
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to resolve error",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error resolving log:", error)
      toast({
        title: "Error",
        description: "An error occurred while resolving the error",
        variant: "destructive",
      })
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "high":
        return <AlertCircle className="h-5 w-5 text-orange-500" />
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "low":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "high":
        return <Badge className="bg-orange-500">High</Badge>
      case "medium":
        return <Badge className="bg-amber-500">Medium</Badge>
      case "low":
        return <Badge className="bg-blue-500">Low</Badge>
      default:
        return <Badge>{severity}</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "authentication":
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-700">
            Authentication
          </Badge>
        )
      case "database":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-700">
            Database
          </Badge>
        )
      case "api":
        return (
          <Badge variant="outline" className="border-green-500 text-green-700">
            API
          </Badge>
        )
      case "ui":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-700">
            UI
          </Badge>
        )
      case "integration":
        return (
          <Badge variant="outline" className="border-indigo-500 text-indigo-700">
            Integration
          </Badge>
        )
      case "validation":
        return (
          <Badge variant="outline" className="border-orange-500 text-orange-700">
            Validation
          </Badge>
        )
      case "system":
        return (
          <Badge variant="outline" className="border-red-500 text-red-700">
            System
          </Badge>
        )
      default:
        return <Badge variant="outline">{category}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </div>

        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!errorLog) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Error Log Not Found</h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              The requested error log could not be found. It may have been deleted or you may not have permission to
              view it.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/admin/error-logs")}>Return to Error Logs</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Error Log Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            {errorLog.resolved ? (
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                <span className="font-medium text-green-700">Resolved</span>
                {errorLog.resolved_by && (
                  <span className="ml-2 text-sm text-muted-foreground">by {errorLog.resolved_by}</span>
                )}
              </div>
            ) : (
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="font-medium text-red-700">Open</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {getSeverityIcon(errorLog.severity)}
              <span className="ml-2">{getSeverityBadge(errorLog.severity)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Layers className="h-5 w-5 text-indigo-500 mr-2" />
              <span>{getCategoryBadge(errorLog.category)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Error Message</CardTitle>
          <CardDescription>Occurred on {format(new Date(errorLog.created_at), "PPpp")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-gray-100 rounded-md font-mono text-sm overflow-x-auto">{errorLog.error_message}</div>
        </CardContent>
      </Card>

      <Tabs defaultValue="stack" className="mb-6">
        <TabsList>
          <TabsTrigger value="stack">Stack Trace</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="context">Context</TabsTrigger>
        </TabsList>

        <TabsContent value="stack" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Stack Trace</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border">
                <div className="p-4 font-mono text-xs whitespace-pre-wrap">
                  {errorLog.error_stack || "No stack trace available"}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metadata" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border">
                <div className="p-4 font-mono text-xs">
                  {errorLog.metadata ? (
                    <pre>{JSON.stringify(errorLog.metadata, null, 2)}</pre>
                  ) : (
                    "No metadata available"
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="context" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Error Context</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {errorLog.url && (
                  <div className="flex items-start">
                    <Globe className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">URL</div>
                      <div className="text-sm font-mono break-all">{errorLog.url}</div>
                    </div>
                  </div>
                )}

                {errorLog.user_id && (
                  <div className="flex items-start">
                    <User className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">User ID</div>
                      <div className="text-sm font-mono">{errorLog.user_id}</div>
                    </div>
                  </div>
                )}

                {errorLog.session_id && (
                  <div className="flex items-start">
                    <Layers className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Session ID</div>
                      <div className="text-sm font-mono">{errorLog.session_id}</div>
                    </div>
                  </div>
                )}

                {errorLog.user_agent && (
                  <div className="flex items-start">
                    <Globe className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">User Agent</div>
                      <div className="text-sm font-mono break-all">{errorLog.user_agent}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Timestamps</div>
                    <div className="text-sm">
                      <div>Created: {format(new Date(errorLog.created_at), "PPpp")}</div>
                      {errorLog.updated_at && <div>Updated: {format(new Date(errorLog.updated_at), "PPpp")}</div>}
                      {errorLog.resolved_at && <div>Resolved: {format(new Date(errorLog.resolved_at), "PPpp")}</div>}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => router.push("/admin/error-logs")} className="mr-2">
          Back to Error Logs
        </Button>

        {!errorLog.resolved && (
          <Button onClick={handleResolveError}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark as Resolved
          </Button>
        )}
      </div>
    </div>
  )
}
