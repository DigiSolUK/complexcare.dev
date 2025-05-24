"use client"

import { Check, Clock, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

type Task = {
  id: string
  title: string
  status: "pending" | "in_progress" | "completed" | "cancelled" | "overdue"
  priority: "low" | "medium" | "high" | "urgent"
  dueDate: string
  assignedTo: string
}

export function TasksList() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "T001",
      title: "Review medication plan for John Doe",
      status: "pending",
      priority: "high",
      dueDate: "2023-06-15",
      assignedTo: "Dr. Sarah Johnson",
    },
    {
      id: "T002",
      title: "Schedule follow-up appointment for Jane Smith",
      status: "completed",
      priority: "medium",
      dueDate: "2023-06-10",
      assignedTo: "Nurse Williams",
    },
    {
      id: "T003",
      title: "Update DBS check for staff member",
      status: "overdue",
      priority: "urgent",
      dueDate: "2023-06-05",
      assignedTo: "HR Manager",
    },
  ])

  const handleTaskComplete = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: task.status === "completed" ? "pending" : "completed" } : task,
      ),
    )
  }

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3 text-yellow-500" />
      case "in_progress":
        return <Clock className="h-3 w-3 text-blue-500" />
      case "completed":
        return <Check className="h-3 w-3 text-green-500" />
      case "cancelled":
        return <AlertCircle className="h-3 w-3 text-gray-500" />
      case "overdue":
        return <AlertCircle className="h-3 w-3 text-red-500" />
    }
  }

  const getPriorityBadge = (priority: Task["priority"]) => {
    switch (priority) {
      case "low":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Low
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Medium
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            High
          </Badge>
        )
      case "urgent":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Urgent
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className={`flex items-start gap-2 ${task.status === "completed" ? "opacity-60" : ""}`}>
          <Checkbox
            checked={task.status === "completed"}
            onCheckedChange={() => handleTaskComplete(task.id)}
            className="mt-0.5"
          />
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className={`text-sm font-medium ${task.status === "completed" ? "line-through" : ""}`}>{task.title}</p>
              {getPriorityBadge(task.priority)}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                {getStatusIcon(task.status)}
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full" asChild>
        <Link href="/tasks">View all tasks</Link>
      </Button>
    </div>
  )
}
