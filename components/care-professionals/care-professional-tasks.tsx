"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, CheckCircle, Clock, Plus, RefreshCw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { format, addDays } from "date-fns"

interface CareProfessionalTasksProps {
  professionalId: string
}

export function CareProfessionalTasks({ professionalId }: CareProfessionalTasksProps) {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [professionalId])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)

      // In a real app, fetch from API
      // const response = await fetch(`/api/care-professionals/${professionalId}/tasks`)
      // if (!response.ok) throw new Error("Failed to fetch tasks")
      // const data = await response.json()

      // For demo purposes, use mock data
      const demoTasks = getDemoTasks(professionalId)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      setTasks(demoTasks)
    } catch (error) {
      console.error("Error fetching tasks:", error)
      setError("Failed to load tasks")
      setTasks(getDemoTasks(professionalId)) // Fallback to demo data
    } finally {
      setLoading(false)
    }
  }

  const getDemoTasks = (id: string) => {
    const today = new Date()
    const tomorrow = addDays(today, 1)
    const nextWeek = addDays(today, 7)

    // Base tasks
    const baseTasks = [
      {
        id: `task-${id}-1`,
        title: "Complete patient assessment",
        description: "Finalize the assessment report for John Smith",
        due_date: format(tomorrow, "yyyy-MM-dd"),
        priority: "high",
        status: "in-progress",
        related_to: "Patient: John Smith",
        assigned_by: "Dr. Wilson",
      },
      {
        id: `task-${id}-2`,
        title: "Update care plan",
        description: "Review and update the care plan for Mary Johnson",
        due_date: format(today, "yyyy-MM-dd"),
        priority: "medium",
        status: "pending",
        related_to: "Patient: Mary Johnson",
        assigned_by: "Care Coordinator",
      },
      {
        id: `task-${id}-3`,
        title: "Submit timesheet",
        description: "Complete and submit timesheet for last week",
        due_date: format(today, "yyyy-MM-dd"),
        priority: "low",
        status: "completed",
        related_to: "Administrative",
        assigned_by: "HR Department",
      },
      {
        id: `task-${id}-4`,
        title: "Attend team meeting",
        description: "Weekly team meeting to discuss patient cases",
        due_date: format(nextWeek, "yyyy-MM-dd"),
        priority: "medium",
        status: "pending",
        related_to: "Team",
        assigned_by: "Team Lead",
      },
    ]

    // Customize based on professional ID
    if (id === "cp-001") {
      // Nurse
      baseTasks[0].title = "Medication review"
      baseTasks[1].title = "Wound care assessment"
    } else if (id === "cp-002") {
      // Physiotherapist
      baseTasks[0].title = "Create exercise plan"
      baseTasks[1].title = "Mobility assessment"
    } else if (id === "cp-003") {
      // Occupational Therapist
      baseTasks[0].title = "Home environment assessment"
      baseTasks[1].title = "Daily living skills evaluation"
    }

    return baseTasks
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>
      case "low":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Low
          </Badge>
        )
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
            <span>Completed</span>
          </div>
        )
      case "in-progress":
        return (
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-blue-600" />
            <span>In Progress</span>
          </div>
        )
      case "pending":
        return (
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-yellow-600" />
            <span>Pending</span>
          </div>
        )
      default:
        return <span>{status}</span>
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Tasks</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={fetchTasks}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Assigned Tasks</CardTitle>
          <CardDescription>View and manage tasks assigned to this care professional</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Related To</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{task.title}</div>
                      <div className="text-sm text-muted-foreground">{task.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CalendarIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span>{task.due_date}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell>{task.related_to}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
