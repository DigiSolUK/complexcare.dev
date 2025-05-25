"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { getPatientActivities } from "@/lib/services/activity-log-service"
import { formatDistanceToNow } from "date-fns"
import { Calendar, ClipboardList, FileText, Pill, User, Eye, ActivityIcon } from "lucide-react"

interface Activity {
  id: string
  activity_type: string
  description: string
  created_at: string
  metadata: any
  user_name: string
}

interface PatientActivityHistoryProps {
  patientId: string
}

export function PatientActivityHistory({ patientId }: PatientActivityHistoryProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)
        const data = await getPatientActivities(patientId)
        setActivities(data)
      } catch (error) {
        console.error("Error fetching patient activities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [patientId])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "patient_created":
      case "patient_updated":
        return User
      case "patient_viewed":
        return Eye
      case "appointment_created":
      case "appointment_updated":
      case "appointment_cancelled":
        return Calendar
      case "care_plan_created":
      case "care_plan_updated":
        return ClipboardList
      case "medication_added":
      case "medication_updated":
      case "medication":
        return Pill
      case "clinical_note_created":
      case "clinical_note_updated":
        return FileText
      case "visit":
      case "assessment":
        return ActivityIcon
      default:
        return ActivityIcon
    }
  }

  const getActivityColor = (type: string) => {
    if (type.includes("created")) return "text-green-600"
    if (type.includes("updated")) return "text-blue-600"
    if (type.includes("cancelled")) return "text-red-600"
    if (type.includes("viewed")) return "text-gray-600"
    return "text-gray-600"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity History</CardTitle>
          <CardDescription>Recent activities for this patient</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
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
        <CardTitle>Activity History</CardTitle>
        <CardDescription>Recent activities for this patient</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {activities.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-center">
              <div>
                <ActivityIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-muted-foreground">No activities recorded yet</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => {
                const Icon = getActivityIcon(activity.activity_type)
                const color = getActivityColor(activity.activity_type)

                return (
                  <div key={activity.id} className="flex gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 ${color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.user_name || "System"} •{" "}
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </p>
                      {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          {activity.metadata.appointmentDate && (
                            <span>Date: {new Date(activity.metadata.appointmentDate).toLocaleDateString()}</span>
                          )}
                          {activity.metadata.appointmentType && (
                            <span> • Type: {activity.metadata.appointmentType}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
