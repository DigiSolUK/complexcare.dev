"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Clock, User, FileText, Pill, CalendarCheck, UserPlus, Edit } from "lucide-react"
import { format, parseISO } from "date-fns"

interface ActivityLogEntry {
  id: string
  type: "note" | "appointment" | "medication" | "care_plan" | "assignment" | "update"
  title: string
  description: string
  timestamp: string
  user_name?: string
  user_avatar?: string
  metadata?: Record<string, any>
}

interface PatientActivityLogProps {
  patientId: string
}

export function PatientActivityLog({ patientId }: PatientActivityLogProps) {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/patients/${patientId}/activities`)
      if (!response.ok) throw new Error("Failed to fetch activities")
      const data = await response.json()
      setActivities(data)
    } catch (error) {
      console.error("Error fetching activities:", error)
      setError("Failed to load activity log")
      // Mock data for demo
      setActivities([
        {
          id: "1",
          type: "note",
          title: "Care Note Added",
          description: "Added daily observation notes regarding patient mobility improvement",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          user_name: "Sarah Johnson",
          user_avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        },
        {
          id: "2",
          type: "appointment",
          title: "Appointment Scheduled",
          description: "Physiotherapy session scheduled for next Tuesday at 2:00 PM",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          user_name: "James Williams",
          user_avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        {
          id: "3",
          type: "medication",
          title: "Medication Updated",
          description: "Dosage adjusted for Metformin - increased to 500mg twice daily",
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          user_name: "Dr. Emily Brown",
          user_avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        },
        {
          id: "4",
          type: "care_plan",
          title: "Care Plan Updated",
          description: "Updated care plan to include new mobility exercises and dietary recommendations",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          user_name: "Sarah Johnson",
          user_avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        },
        {
          id: "5",
          type: "assignment",
          title: "Care Professional Assigned",
          description: "Robert Smith assigned as primary healthcare assistant",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          user_name: "Admin User",
        },
        {
          id: "6",
          type: "update",
          title: "Patient Information Updated",
          description: "Emergency contact information updated",
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          user_name: "Reception Staff",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [patientId])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "note":
        return <FileText className="h-4 w-4" />
      case "appointment":
        return <CalendarCheck className="h-4 w-4" />
      case "medication":
        return <Pill className="h-4 w-4" />
      case "care_plan":
        return <FileText className="h-4 w-4" />
      case "assignment":
        return <UserPlus className="h-4 w-4" />
      case "update":
        return <Edit className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "note":
        return "bg-blue-100 text-blue-800"
      case "appointment":
        return "bg-green-100 text-green-800"
      case "medication":
        return "bg-purple-100 text-purple-800"
      case "care_plan":
        return "bg-orange-100 text-orange-800"
      case "assignment":
        return "bg-indigo-100 text-indigo-800"
      case "update":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Loading recent activities...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>Recent activities and updates for this patient</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">No activities recorded yet.</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-b-0">
                <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{activity.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {activity.type.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {activity.user_avatar ? (
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={activity.user_avatar || "/placeholder.svg"} alt={activity.user_name} />
                        <AvatarFallback>{activity.user_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <User className="h-3 w-3" />
                    )}
                    <span>{activity.user_name || "System"}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(parseISO(activity.timestamp), "MMM dd, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{format(parseISO(activity.timestamp), "HH:mm")}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
