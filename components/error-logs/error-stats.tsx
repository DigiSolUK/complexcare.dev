"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, AlertCircle, XCircle } from "lucide-react"
import { LineChart } from "@/components/charts/line-chart"
import { PieChart } from "@/components/charts/pie-chart"

interface ErrorStats {
  total: number
  unresolved: number
  critical: number
  bySeverity: Record<string, number>
  byCategory: Record<string, number>
  recentTrend: { date: string; count: number }[]
}

export function ErrorStats() {
  const [stats, setStats] = useState<ErrorStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/error-logs/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        } else {
          console.error("Failed to fetch error stats")
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return null
  }

  // Prepare chart data
  const severityChartData = Object.entries(stats.bySeverity).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
  }))

  const categoryChartData = Object.entries(stats.byCategory).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
  }))

  const trendChartData = stats.recentTrend.map((item) => ({
    name: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: item.count,
  }))

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unresolved Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
              <div className="text-2xl font-bold">{stats.unresolved}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <div className="text-2xl font-bold">{stats.critical}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trend" className="mb-6">
        <TabsList>
          <TabsTrigger value="trend">Error Trend</TabsTrigger>
          <TabsTrigger value="severity">By Severity</TabsTrigger>
          <TabsTrigger value="category">By Category</TabsTrigger>
        </TabsList>

        <TabsContent value="trend" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Error Trend (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <LineChart data={trendChartData} xAxisKey="name" yAxisKey="value" lineColor="#f97316" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="severity" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Errors by Severity</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="h-[300px] w-[300px]">
                <PieChart
                  data={severityChartData}
                  nameKey="name"
                  dataKey="value"
                  colors={["#f43f5e", "#f97316", "#facc15", "#3b82f6"]}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Errors by Category</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="h-[300px] w-[300px]">
                <PieChart
                  data={categoryChartData}
                  nameKey="name"
                  dataKey="value"
                  colors={["#a855f7", "#3b82f6", "#22c55e", "#facc15", "#6366f1", "#f97316", "#ef4444"]}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}
