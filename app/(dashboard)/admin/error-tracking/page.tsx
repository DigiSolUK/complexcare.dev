"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, CheckCircle, Clock, AlertCircle, RefreshCw, Search } from "lucide-react"
import { format } from "date-fns"
import { ErrorBoundary } from "@/components/error-boundary"

interface ErrorLog {
  id: string
  message: string
  component_path: string
  created_at: string
  severity: string
  resolved: boolean
  stack?: string
  browser_info?: any
  request_data?: any
  user_id?: string
  resolved_at?: string
  resolution_notes?: string
}

export default function ErrorTrackingPage() {
  const [errors, setErrors] = useState<ErrorLog[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null)
  const [resolutionNotes, setResolutionNotes] = useState("")
  const [resolving, setResolving] = useState(false)

  const fetchErrors = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/errors")
      if (!response.ok) {
        throw new Error("Failed to fetch errors")
      }
      const data = await response.json()
      setErrors(data.errors || [])
    } catch (error) {
      console.error("Error fetching error logs:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchErrors()
  }, [])

  const handleResolveError = async () => {
    if (!selectedError) return

    setResolving(true)
    try {
      const response = await fetch(`/api/admin/errors/${selectedError.id}/resolve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes: resolutionNotes }),
      })

      if (!response.ok) {
        throw new Error("Failed to resolve error")
      }

      // Update the local state
      setErrors(
        errors.map((err) =>
          err.id === selectedError.id
            ? { ...err, resolved: true, resolution_notes: resolutionNotes, resolved_at: new Date().toISOString() }
            : err,
        ),
      )

      setSelectedError(null)
    } catch (error) {
      console.error("Error resolving error log:", error)
    } finally {
      setResolving(false)
    }
  }

  const filteredErrors = errors.filter((error) => {
    if (activeTab === "all") return true
    if (activeTab === "unresolved") return !error.resolved
    if (activeTab === "critical") return error.severity === "critical"
    if (activeTab === "high") return error.severity === "high"
    return true
  })

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> Critical
          </Badge>
        )
      case "high":
        return (
          <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="text-muted-foreground flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Low
          </Badge>
        )
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Error Tracking</h1>
            <p className="text-muted-foreground">Monitor and manage application errors</p>
          </div>
          <Button onClick={fetchErrors} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{errors.length}</CardTitle>
              <CardDescription>Total Errors</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{errors.filter((e) => !e.resolved).length}</CardTitle>
              <CardDescription>Unresolved Errors</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">
                {errors.filter((e) => e.severity === "critical" || e.severity === "high").length}
              </CardTitle>
              <CardDescription>Critical/High Severity</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{errors.filter((e) => e.resolved).length}</CardTitle>
              <CardDescription>Resolved Errors</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Errors</TabsTrigger>
            <TabsTrigger value="unresolved">Unresolved</TabsTrigger>
            <TabsTrigger value="critical">Critical</TabsTrigger>
            <TabsTrigger value="high">High Severity</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex justify-center items-center p-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredErrors.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Search className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No errors found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Error</TableHead>
                        <TableHead>Component</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredErrors.map((error) => (
                        <TableRow key={error.id}>
                          <TableCell className="font-medium max-w-xs truncate">{error.message}</TableCell>
                          <TableCell className="max-w-xs truncate">{error.component_path || "Unknown"}</TableCell>
                          <TableCell>{getSeverityBadge(error.severity)}</TableCell>
                          <TableCell>{format(new Date(error.created_at), "dd MMM yyyy HH:mm")}</TableCell>
                          <TableCell>
                            {error.resolved ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Resolved
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                Open
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedError(error)}>
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Error Details Dialog */}
      <Dialog open={!!selectedError} onOpenChange={(open) => !open && setSelectedError(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Error Details</DialogTitle>
            <DialogDescription>Detailed information about the error</DialogDescription>
          </DialogHeader>

          {selectedError && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Error Message</h3>
                <p className="p-2 bg-muted rounded-md">{selectedError.message}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Component</h3>
                  <p className="text-sm">{selectedError.component_path || "Unknown"}</p>
                </div>
                <div>
                  <h3 className="font-medium">Severity</h3>
                  <div>{getSeverityBadge(selectedError.severity)}</div>
                </div>
                <div>
                  <h3 className="font-medium">Created At</h3>
                  <p className="text-sm">{format(new Date(selectedError.created_at), "dd MMM yyyy HH:mm:ss")}</p>
                </div>
                <div>
                  <h3 className="font-medium">Status</h3>
                  <p className="text-sm">{selectedError.resolved ? "Resolved" : "Open"}</p>
                </div>
              </div>

              {selectedError.stack && (
                <div>
                  <h3 className="font-medium">Stack Trace</h3>
                  <pre className="p-2 bg-muted rounded-md text-xs overflow-x-auto whitespace-pre-wrap">
                    {selectedError.stack}
                  </pre>
                </div>
              )}

              {selectedError.browser_info && (
                <div>
                  <h3 className="font-medium">Browser Information</h3>
                  <pre className="p-2 bg-muted rounded-md text-xs overflow-x-auto">
                    {JSON.stringify(selectedError.browser_info, null, 2)}
                  </pre>
                </div>
              )}

              {selectedError.resolved ? (
                <div>
                  <h3 className="font-medium">Resolution</h3>
                  <p className="text-sm">
                    Resolved on{" "}
                    {selectedError.resolved_at
                      ? format(new Date(selectedError.resolved_at), "dd MMM yyyy HH:mm:ss")
                      : "Unknown"}
                  </p>
                  {selectedError.resolution_notes && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium">Notes</h4>
                      <p className="p-2 bg-muted rounded-md text-sm">{selectedError.resolution_notes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h3 className="font-medium">Resolution Notes</h3>
                  <Textarea
                    placeholder="Enter notes about how this error was resolved..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={handleResolveError} className="mt-2 w-full" disabled={resolving}>
                    {resolving ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Resolving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Resolved
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  )
}
