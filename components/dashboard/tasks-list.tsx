"use client"
import Link from "next/link"
import { Clock, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { PendingTask } from "@/lib/actions/dashboard-actions"

interface TasksListProps {
  tasks?: PendingTask[]
  isLoading?: boolean
}

export function TasksList({ tasks, isLoading = false }: TasksListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-3 w-[200px]" />
          </div>
        ))}
      </div>
    )
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed p-8 text-center">
        <div>
          <p className="text-sm text-muted-foreground">No pending tasks</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const dueDate = task.dueDate ? new Date(task.dueDate) : null
        const isOverdue = dueDate && dueDate < new Date()
        const formattedDueDate = dueDate
          ? dueDate.toLocaleDateString("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })
          : "No due date"

        return (
          <Link
            key={task.id}
            href={`/tasks/${task.id}`}
            className="block rounded-lg p-3 transition-colors hover:bg-muted"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{task.title}</h4>
              <TaskPriorityBadge priority={task.priority} />
            </div>
            <div className="mt-1 flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-3.5 w-3.5" />
              <span className={isOverdue ? "text-red-500 font-medium" : ""}>
                {formattedDueDate}
                {isOverdue ? " (Overdue)" : ""}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Assigned to: {task.assignedTo}</p>
          </Link>
        )
      })}
    </div>
  )
}

function TaskPriorityBadge({ priority }: { priority: "low" | "medium" | "high" }) {
  switch (priority) {
    case "high":
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          High
        </Badge>
      )
    case "medium":
      return <Badge variant="default">Medium</Badge>
    case "low":
      return <Badge variant="outline">Low</Badge>
    default:
      return null
  }
}
