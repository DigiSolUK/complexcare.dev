"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  getErrorStatistics,
  getErrors,
  markErrorAsResolved,
  type ErrorSeverity,
  type ErrorCategory,
} from "@/lib/services/error-logging-service"
import { BarChart, LineChart, PieChart } from "@/components/charts"
import { AlertTriangle, CheckCircle, Clock, Filter, RefreshCw, Search, XCircle } from "lucide-react"
import { format, parseISO } from "date-fns"

export function ErrorDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [statistics, setStatistics] = useState<any>(null)
  const [errors, setErrors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    severity: "",
    category: "",
    resolved: "",
    search: "",
    days: 30,
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  })

  // Fetch error statistics
  const fetchStatistics = async () => {
    try {
      const stats = await getErrorStatistics(undefined, filters.days)
      setStatistics(stats)
    } catch (error) {
      console.error("Failed to fetch error statistics:", error)
    }
  }

  // Fetch error logs
  const fetchErrors = async () => {
    setLoading(true)
    try {
      const result = await getErrors(undefined, {
        severity: filters.severity ? (filters.severity as ErrorSeverity) : undefined,
        category: filters.category ? (filters.category as ErrorCategory) : undefined,
        resolved: filters.resolved === "true" ? true : filters.resolved === "false" ? false : undefined,
        search: filters.search || undefined,
        limit: pagination.limit,
        offset: (pagination.page - 1) * pagination.limit,
      })

      setErrors(result.errors)
      setPagination((prev) => ({ ...prev, total: result.total }))
    } catch (error) {
      console.error("Failed to fetch errors:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle resolving an error
  const handleResolveError = async (errorId: string) => {
    try {
      const success = await markErrorAsResolved(errorId, "admin")
      if (success) {
        fetchErrors()
        fetchStatistics()
      }
    } catch (error) {
      console.error("Failed to resolve error:", error)
    }
  }

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPagination((prev) => ({ ...prev, page: 1 })) // Reset to first page on filter change
  }

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  // Initial data fetch
  useEffect(() => {
    fetchStatistics()
  }, [filters.days])

  // Fetch errors when filters or pagination changes
  useEffect(() => {
    fetchErrors()
  }, [filters.severity, filters.category, filters.resolved, pagination.page, pagination.limit])

  // Prepare chart data
  const prepareSeverityChartData = () => {
    if (!statistics?.bySeverity) return []

    return statistics.bySeverity.map((item: any) => ({
      name: item.severity.charAt(0).toUpperCase() + item.severity.slice(1),
      value: Number.parseInt(item.count, 10),
    }))
  }

  const prepareCategoryChartData = () => {
    if (!statistics?.byCategory) return []

    return statistics.byCategory.map((item: any) => ({
      name: item.category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      value: Number.parseInt(item.count, 10),
    }))
  }

  const prepareDailyChartData = () => {
    if (!statistics?.daily) return []

    return statistics.daily.map((item: any) => ({
      date: format(new Date(item.day), "MMM dd"),
      errors: Number.parseInt(item.count, 10),
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Error Monitoring</h2>
          <p className="text-muted-foreground">Track and manage application errors across the platform</p>
        </div>
        <Button
          onClick={() => {
            fetchStatistics()
            fetchErrors()
          }}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="errors">Error Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Error Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics?.totalErrors || 0}</div>
                <p className="text-xs text-muted-foreground">In the last {filters.days} days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unresolved</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics?.unresolvedErrors || 0}</div>
                <p className="text-xs text-muted-foreground">Errors requiring attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Errors</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statistics?.bySeverity?.find((s: any) => s.severity === "critical")?.count || 0}
                </div>
                <p className="text-xs text-muted-foreground">High priority issues</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statistics?.totalErrors
                    ? Math.round(
                        ((statistics.totalErrors - statistics.unresolvedErrors) / statistics.totalErrors) * 100,
                      )
                    : 0}
                  %
                </div>
                <p className="text-xs text-muted-foreground">Of errors resolved</p>
              </CardContent>
            </Card>
          </div>

          {/* Time Period Selector */}
          <div className="flex justify-end">
            <Select value={filters.days.toString()} onValueChange={(value) => handleFilterChange("days", value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="14">Last 14 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Errors by Severity</CardTitle>
                <CardDescription>Distribution of errors by severity level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <PieChart data={prepareSeverityChartData()} colors={["#ef4444", "#f97316", "#eab308", "#84cc16"]} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Errors by Category</CardTitle>
                <CardDescription>Distribution of errors by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <BarChart
                    data={prepareCategoryChartData()}
                    index="name"
                    categories={["value"]}
                    colors={["#3b82f6"]}
                    valueFormatter={(value) => `${value} errors`}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Error Trend</CardTitle>
                <CardDescription>Error frequency over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <LineChart
                    data={prepareDailyChartData()}
                    index="date"
                    categories={["errors"]}
                    colors={["#8b5cf6"]}
                    valueFormatter={(value) => `${value} errors`}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Common Errors */}
          <Card>
            <CardHeader>
              <CardTitle>Most Common Errors</CardTitle>
              <CardDescription>Frequently occurring errors</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Error Message</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statistics?.commonErrors?.map((error: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-xs">
                        {error.error_message.length > 100
                          ? `${error.error_message.substring(0, 100)}...`
                          : error.error_message}
                      </TableCell>
                      <TableCell className="text-right">{error.count}</TableCell>
                    </TableRow>
                  ))}
                  {(!statistics?.commonErrors || statistics.commonErrors.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">
                        No error data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Error Logs</CardTitle>
                <Filter className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription>View and manage detailed error logs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search errors..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" onClick={() => fetchErrors()}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                <Select value={filters.severity} onValueChange={(value) => handleFilterChange("severity", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="authentication">Authentication</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="api">API</SelectItem>
                    <SelectItem value="ui">UI</SelectItem>
                    <SelectItem value="integration">Integration</SelectItem>
                    <SelectItem value="validation">Validation</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="network">Network</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.resolved} onValueChange={(value) => handleFilterChange("resolved", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="false">Unresolved</SelectItem>
                    <SelectItem value="true">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Error List */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Error</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <div className="flex justify-center items-center">
                          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : errors.length > 0 ? (
                    errors.map((error) => (
                      <TableRow key={error.id}>
                        <TableCell className="font-mono text-xs max-w-md truncate">{error.error_message}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              error.severity === "critical"
                                ? "destructive"
                                : error.severity === "high"
                                  ? "destructive"
                                  : error.severity === "medium"
                                    ? "default"
                                    : "outline"
                            }
                          >
                            {error.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>{error.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{format(parseISO(error.created_at), "MMM dd, HH:mm")}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {error.resolved ? (
                            <Badge
                              variant="success"
                              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            >
                              Resolved
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            >
                              Unresolved
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {!error.resolved && (
                            <Button variant="outline" size="sm" onClick={() => handleResolveError(error.id)}>
                              Resolve
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        No errors found matching the current filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>

            {/* Pagination */}
            {pagination.total > 0 && (
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} errors
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page * pagination.limit >= pagination.total}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
