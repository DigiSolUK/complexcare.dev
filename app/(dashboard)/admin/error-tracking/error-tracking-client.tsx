"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ErrorLog {
  id: string
  message: string
  stack?: string
  component_path?: string
  severity: "low" | "medium" | "high" | "critical"
  status: "new" | "investigating" | "resolved"
  browser_info?: any
  user_id?: string
  tenant_id: string
  created_at: string
  resolved_at?: string
  resolved_by?: string
  occurrence_count: number
}

interface ErrorStats {
  total: number
  new: number
  investigating: number
  resolved: number
  critical: number
  high: number
  medium: number
  low: number
}

export function ErrorTrackingClient() {
  const [errors, setErrors] = useState<ErrorLog[]>([])
  const [stats, setStats] = useState<ErrorStats>({
    total: 0,
    new: 0,
    investigating: 0,
    resolved: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  })
  const [loading, setLoading] = useState(true)
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [refreshing, setRefreshing] = useState(false)

  const fetchErrors = async () => {
    try {
      const response = await fetch("/api/admin/errors")
      if (!response.ok) throw new Error("Failed to fetch errors")

      const data = await response.json()
      setErrors(data.errors || [])
      setStats(
        data.stats || {
          total: 0,
          new: 0,
          investigating: 0,
          resolved: 0,
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
        },
      )
    } catch (error) {
      console.error("Error fetching error logs:", error)
      toast({
        title: "Error",
        description: "Failed to load error logs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchErrors()
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchErrors, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchErrors()
  }

  const handleResolveError = async (errorId: string) => {
    try {
      const response = await fetch(`/api/admin/errors/${errorId}/resolve`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to resolve error")

      toast({
        title: "Success",
        description: "Error marked as resolved",
      })

      fetchErrors()
    } catch (error) {
      console.error("Error resolving error:", error)
      toast({
        title: "Error",
        description: "Failed to resolve error",
        variant: "destructive",
      })
    }
  }

  const filteredErrors = errors.filter((error) => {
    const matchesSearch =
      error.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      error.component_path?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = severityFilter === "all" || error.severity === severityFilter
    const matchesStatus = statusFilter === "all" || error.status === statusFilter

    return matchesSearch && matchesSeverity && matchesStatus
  })

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "low":
        return <AlertTriangle className="h-4 w-4 text-blue-600" />
      default:
        return null
    }
  }

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, "destructive" | "default" | "secondary" | "outline"> = {
      critical: "destructive",
      high: "destructive",
      medium: "default",
      low: "secondary",
    }

    return (
      <Badge variant={variants[severity] || "outline"} className="capitalize">
        {severity}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "destructive" | "default" | "secondary" | "outline"> = {
      new: "destructive",
      investigating: "default",
      resolved: "secondary",
    }

    return (
      <Badge variant={variants[status] || "outline"} className="capitalize">
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{stats.new} new errors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.critical}</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investigating</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.investigating}</div>
            <p className="text-xs text-muted-foreground">Currently being investigated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">Successfully resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Error Logs</CardTitle>
              <CardDescription>Monitor and resolve application errors</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search errors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Error Message</TableHead>
                  <TableHead>Component</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Occurrences</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredErrors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No errors found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredErrors.map((error) => (
                    <TableRow key={error.id}>
                      <TableCell>{getSeverityIcon(error.severity)}</TableCell>
                      <TableCell className="max-w-[300px]">
                        <div className="truncate font-medium">{error.message}</div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs">{error.component_path || "Unknown"}</code>
                      </TableCell>
                      <TableCell>{getSeverityBadge(error.severity)}</TableCell>
                      <TableCell>{getStatusBadge(error.status)}</TableCell>
                      <TableCell>{error.occurrence_count}</TableCell>
                      <TableCell>{format(new Date(error.created_at), "MMM d, HH:mm")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedError(error)}>
                            View
                          </Button>
                          {error.status !== "resolved" && (
                            <Button variant="ghost" size="sm" onClick={() => handleResolveError(error.id)}>
                              Resolve
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Error Details Dialog */}
      <Dialog open={!!selectedError} onOpenChange={() => setSelectedError(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Error Details</DialogTitle>
            <DialogDescription>
              Full details of the error including stack trace and browser information
            </DialogDescription>
          </DialogHeader>

          {selectedError && (
            <Tabs defaultValue="details" className="mt-4">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="stack">Stack Trace</TabsTrigger>
                <TabsTrigger value="browser">Browser Info</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Error Message</h4>
                  <p className="text-sm text-muted-foreground">{selectedError.message}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Component</h4>
                    <code className="text-xs">{selectedError.component_path || "Unknown"}</code>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Severity</h4>
                    {getSeverityBadge(selectedError.severity)}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Status</h4>
                    {getStatusBadge(selectedError.status)}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Occurrences</h4>
                    <p className="text-sm">{selectedError.occurrence_count}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">First Seen</h4>
                    <p className="text-sm">{format(new Date(selectedError.created_at), "PPpp")}</p>
                  </div>

                  {selectedError.resolved_at && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Resolved At</h4>
                      <p className="text-sm">{format(new Date(selectedError.resolved_at), "PPpp")}</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="stack">
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                  <pre className="text-xs">{selectedError.stack || "No stack trace available"}</pre>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="browser">
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                  <pre className="text-xs">{JSON.stringify(selectedError.browser_info || {}, null, 2)}</pre>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
