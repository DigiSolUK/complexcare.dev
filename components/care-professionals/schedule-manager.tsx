"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock, Trash2 } from "lucide-react"
import { CreateScheduleDialog } from "./create-schedule-dialog"
import { toast } from "@/components/ui/use-toast"

interface Schedule {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_available: boolean
  notes?: string
}

interface ScheduleManagerProps {
  careProfessionalId: string
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function ScheduleManager({ careProfessionalId }: ScheduleManagerProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const fetchSchedules = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/care-professionals/${careProfessionalId}/schedule`)
      if (!response.ok) throw new Error("Failed to fetch schedules")
      const data = await response.json()
      setSchedules(data)
    } catch (error) {
      console.error("Error fetching schedules:", error)
      toast({
        title: "Error",
        description: "Failed to load schedules.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchedules()
  }, [careProfessionalId])

  const handleScheduleCreated = () => {
    fetchSchedules()
    setIsCreateDialogOpen(false)
  }

  const deleteSchedule = async (scheduleId: string) => {
    try {
      const response = await fetch(`/api/care-professionals/schedule/${scheduleId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete schedule")

      toast({
        title: "Success",
        description: "Schedule deleted successfully.",
      })
      fetchSchedules()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete schedule.",
        variant: "destructive",
      })
    }
  }

  // Group schedules by day
  const schedulesByDay = schedules.reduce(
    (acc, schedule) => {
      if (!acc[schedule.day_of_week]) {
        acc[schedule.day_of_week] = []
      }
      acc[schedule.day_of_week].push(schedule)
      return acc
    },
    {} as Record<number, Schedule[]>,
  )

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>Loading schedule...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Weekly Schedule</h3>
          <p className="text-sm text-muted-foreground">Manage availability and working hours</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Schedule
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dayNames.map((dayName, dayIndex) => (
          <Card key={dayIndex}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{dayName}</CardTitle>
            </CardHeader>
            <CardContent>
              {schedulesByDay[dayIndex] ? (
                <div className="space-y-2">
                  {schedulesByDay[dayIndex].map((schedule) => (
                    <div key={schedule.id} className="p-2 border rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span className="text-sm font-medium">
                            {schedule.start_time} - {schedule.end_time}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => deleteSchedule(schedule.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-1">
                        <Badge variant={schedule.is_available ? "default" : "secondary"} className="text-xs">
                          {schedule.is_available ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                      {schedule.notes && <p className="text-xs text-muted-foreground mt-1">{schedule.notes}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No schedule set</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateScheduleDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onScheduleCreated={handleScheduleCreated}
        careProfessionalId={careProfessionalId}
      />
    </div>
  )
}
