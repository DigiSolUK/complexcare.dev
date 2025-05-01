"use client"

import { useState } from "react"
import { Check, Clock, AlertCircle, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

type Task = {
  id: string
  title: string
  description: string
  status: "pending" | "in_progress" | "completed" | "cancelled" | "overdue"
  priority: "low" | "medium" | "high" | "urgent"
  dueDate: string
  assignedTo: string
  relatedToName: string
}

export function TasksList() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "T001",
      title: "Review medication plan",
      description: "Review and update the medication plan for John Doe",
      status: "pending",
      priority: "high",
      dueDate: "2023-06-15",
      assignedTo: "Dr. Sarah Johnson",
      relatedToName: "John Doe",
    },
    {
      id: "T002",
      title: "Schedule follow-up appointment",
      description: "Schedule a follow-up appointment for Jane Smith",
      status: "completed",
      priority: "medium",
      dueDate: "2023-06-10",
      assignedTo: "Nurse Williams",
      relatedToName: "Jane Smith",
    },
    {
      id: "T003",
      title: "Update DBS check",
      description: "Ensure DBS check is up to date for staff member",
      status: "in_progress",
      priority: "medium",
      dueDate: "2023-06-20",
      assignedTo: "HR Manager",
      relatedToName: "Nurse Williams",
    },
    {
      id: "T004",
      title: "Prepare monthly report",
      description: "Prepare the monthly patient outcome report",
      status: "overdue",
      priority: "urgent",
      dueDate: "2023-06-05",
      assignedTo: "Admin User",
      relatedToName: "Monthly Reporting",
    },
    {
      id: "T005",
      title: "Order medical supplies",
      description: "Order new medical supplies for the clinic",
      status: "pending",
      priority: "low",
      dueDate: "2023-06-25",
      assignedTo: "Admin Assistant",
      relatedToName: "Inventory Management",
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
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "completed":
        return <Check className="h-4 w-4 text-green-500" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-gray-500" />
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-500" />
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
        <div
          key={task.id}
          className={`flex items-start gap-4 rounded-lg border p-4 ${task.status === "completed" ? "bg-muted/50" : ""}`}
        >
          <Checkbox checked={task.status === "completed"} onCheckedChange={() => handleTaskComplete(task.id)} />
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                {task.title}
              </p>
              <div className="flex items-center gap-2">
                {getPriorityBadge(task.priority)}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Task</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Delete Task</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{task.description}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs">
              <div className="flex items-center gap-1">
                {getStatusIcon(task.status)}
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
              <div>Assigned to: {task.assignedTo}</div>
              <div>Related to: {task.relatedToName}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
