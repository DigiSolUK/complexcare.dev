"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar } from "lucide-react"

export function CareProfessionalStats() {
  const [stats, setStats] = useState({
    totalProfessionals: 0,
    activeAssignments: 0,
    upcomingAppointments: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch stats or use demo data
    const fetchStats = async () => {
      try {
        setLoading(true)
        // In a real app, you would fetch this data from an API
        // For now, we'll use demo data

        // Sample demo data
        setStats({
          totalProfessionals: 5,
          activeAssignments: 37,
          upcomingAppointments: 24,
        })
      } catch (error) {
        console.error("Error fetching professional stats:", error)
        // Fallback to demo data
        setStats({
          totalProfessionals: 5,
          activeAssignments: 37,
          upcomingAppointments: 24,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="grid grid-cols-1 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Professionals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalProfessionals}</div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{loading ? "..." : stats.upcomingAppointments}</div>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
