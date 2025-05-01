"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart } from "../../../components/charts/bar-chart"
import { LineChart } from "../../../components/charts/line-chart"
import { PieChart } from "../../../components/charts/pie-chart"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChartIcon, AlertTriangle, Users, Clock, Activity } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "@/components/error-boundary"

export default function AIAnalyticsDashboard() {
  const [period, setPeriod] = useState("7d")
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{
    summaryStats: {
      total_executions: number
      successful_executions: number
      avg_execution_time: number
      unique_users: number
    }
    usageByTool: Array<{
      tool_name: string
      executions: number
      successful_executions: number
      avg_execution_time: number
    }>
    usageOverTime: Array<{
      date: string
      executions: number
    }>
    recentErrors: Array<{
      id: number
      tool_name: string
      error_message: string
      created_at: string
    }>
    userActivity: Array<{
      user_id: string
      executions: number
    }>
  } | null>(null)

  useEffect(() => {
    fetchData()
  }, [period])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/ai-analytics?period=${period}`)
      if (!response.ok) {
        throw new Error("Failed to fetch analytics data")
      }
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error("Error fetching analytics data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const errorColumns = [
    {
      accessorKey: "tool_name",
      header: "Tool",
    },
    {
      accessorKey: "error_message",
      header: "Error Message",
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }: { row: any }) => formatDate(row.original.created_at),
    },
  ]

  return (
    <ErrorBoundary componentPath="app/(dashboard)/ai-analytics/page.tsx">
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Analytics Dashboard</h1>
            <p className="text-muted-foreground">Monitor AI tool usage, performance, and effectiveness</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchData}>Refresh</Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">{data?.summaryStats?.total_executions || 0}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <PieChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">
                  {data?.summaryStats?.total_executions
                    ? Math.round((data.summaryStats.successful_executions / data.summaryStats.total_executions) * 100)
                    : 0}
                  %
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">
                  {data?.summaryStats?.avg_execution_time ? Math.round(data.summaryStats.avg_execution_time) : 0} ms
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">{data?.summaryStats?.unique_users || 0}</div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="usage" className="space-y-4">
          <TabsList>
            <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
            <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
            <TabsTrigger value="errors">Error Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="usage" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Usage Over Time */}
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>AI Tool Usage Over Time</CardTitle>
                  <CardDescription>Daily executions of AI tools</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <Skeleton className="h-full w-full" />
                    </div>
                  ) : (
                    <LineChart
                      data={
                        data?.usageOverTime.map((item) => ({
                          name: formatDate(item.date),
                          value: item.executions,
                        })) || []
                      }
                      xAxisKey="name"
                      yAxisKey="value"
                      categories={["value"]}
                      colors={["#0ea5e9"]}
                      valueFormatter={(value) => `${value} executions`}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Most Used Tools */}
              <Card>
                <CardHeader>
                  <CardTitle>Most Used AI Tools</CardTitle>
                  <CardDescription>Total executions by tool</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <Skeleton className="h-full w-full" />
                    </div>
                  ) : (
                    <BarChart
                      data={
                        data?.usageByTool.slice(0, 10).map((item) => ({
                          name: item.tool_name.replace(/-/g, " "),
                          value: item.executions,
                        })) || []
                      }
                      xAxisKey="name"
                      yAxisKey="value"
                      categories={["value"]}
                      colors={["#0ea5e9"]}
                      valueFormatter={(value) => `${value} executions`}
                      layout="vertical"
                    />
                  )}
                </CardContent>
              </Card>

              {/* Success Rate by Tool */}
              <Card>
                <CardHeader>
                  <CardTitle>Success Rate by Tool</CardTitle>
                  <CardDescription>Percentage of successful executions</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <Skeleton className="h-full w-full" />
                    </div>
                  ) : (
                    <PieChart
                      data={
                        data?.usageByTool
                          .filter((item) => item.executions > 0)
                          .slice(0, 5)
                          .map((item) => ({
                            name: item.tool_name.replace(/-/g, " "),
                            value: Math.round((item.successful_executions / item.executions) * 100),
                          })) || []
                      }
                      category="value"
                      index="name"
                      valueFormatter={(value) => `${value}%`}
                      colors={["#0ea5e9", "#22c55e", "#eab308", "#ef4444", "#8b5cf6"]}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Average Execution Time by Tool</CardTitle>
                <CardDescription>Response time in milliseconds</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Skeleton className="h-full w-full" />
                  </div>
                ) : (
                  <BarChart
                    data={
                      data?.usageByTool
                        .filter((item) => item.avg_execution_time !== null)
                        .map((item) => ({
                          name: item.tool_name.replace(/-/g, " "),
                          value: Math.round(item.avg_execution_time || 0),
                        })) || []
                    }
                    xAxisKey="name"
                    yAxisKey="value"
                    categories={["value"]}
                    colors={["#0ea5e9"]}
                    valueFormatter={(value) => `${value} ms`}
                    layout="vertical"
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="errors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Errors</CardTitle>
                <CardDescription>Last 10 errors across all AI tools</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : data?.recentErrors && data.recentErrors.length > 0 ? (
                  <DataTable columns={errorColumns} data={data.recentErrors} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No errors found in the selected time period</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  )
}
