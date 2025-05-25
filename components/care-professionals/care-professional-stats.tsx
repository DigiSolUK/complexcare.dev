"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface StatsData {
  totalProfessionals: number
  activeCount: number
  inactiveCount: number
  byRole: {
    name: string
    value: number
    color: string
  }[]
  bySpecialization: {
    name: string
    value: number
    color: string
  }[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FF6B6B", "#6B66FF"]

export function CareProfessionalStats() {
  const [statsData, setStatsData] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // In a real app, this would be an API call
        // const response = await fetch("/api/care-professionals/stats")
        // const data = await response.json()

        // For demo purposes, we'll use mock data
        const mockData: StatsData = {
          totalProfessionals: 42,
          activeCount: 38,
          inactiveCount: 4,
          byRole: [
            { name: "Registered Nurse", value: 15, color: COLORS[0] },
            { name: "Healthcare Assistant", value: 12, color: COLORS[1] },
            { name: "Physiotherapist", value: 6, color: COLORS[2] },
            { name: "Occupational Therapist", value: 5, color: COLORS[3] },
            { name: "Other", value: 4, color: COLORS[4] },
          ],
          bySpecialization: [
            { name: "Palliative Care", value: 8, color: COLORS[0] },
            { name: "Elderly Care", value: 10, color: COLORS[1] },
            { name: "Mental Health", value: 7, color: COLORS[2] },
            { name: "Pediatric", value: 5, color: COLORS[3] },
            { name: "Rehabilitation", value: 6, color: COLORS[4] },
            { name: "Other", value: 6, color: COLORS[5] },
          ],
        }

        setStatsData(mockData)
      } catch (err) {
        console.error("Error fetching care professional stats:", err)
        setError("Failed to load statistics")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
        <CardDescription>Care professional statistics and distribution</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
            <Skeleton className="h-[200px] w-full" />
          </div>
        ) : statsData ? (
          <>
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-md border p-3 text-center">
                <div className="text-2xl font-bold">{statsData.activeCount}</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
              <div className="rounded-md border p-3 text-center">
                <div className="text-2xl font-bold">{statsData.inactiveCount}</div>
                <div className="text-xs text-muted-foreground">Inactive</div>
              </div>
            </div>

            <Tabs defaultValue="role">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="role" className="flex-1">
                  By Role
                </TabsTrigger>
                <TabsTrigger value="specialization" className="flex-1">
                  By Specialization
                </TabsTrigger>
              </TabsList>
              <TabsContent value="role" className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statsData.byRole}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statsData.byRole.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="specialization" className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statsData.bySpecialization}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statsData.bySpecialization.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}
