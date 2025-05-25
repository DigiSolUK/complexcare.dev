"use client"
import { format } from "date-fns"
import { Calendar, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-4 w-4 rounded-sm" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
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
        const dueDate = new Date(task.dueDate)
        const formattedDate = format(dueDate, "EEE, MMM d, yyyy")

        return (
          <div key={task.id} className="flex items-start gap-4 rounded-lg p-2 transition-colors hover:bg-muted">
            <Checkbox id={`task-${task.id}`} className="mt-1" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor={`task-${task.id}`} className="text-sm font-medium leading-none cursor-pointer">
                  {task.title}
                </label>
                <TaskPriorityBadge priority={task.priority} />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{task.assignedTo}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Due: {formattedDate}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TaskPriorityBadge({ priority }: { priority: string }) {
  switch (priority) {
    case "high":
      return <Badge variant="destructive">High</Badge>
    case "medium":
      return <Badge variant="default">Medium</Badge>
    case "low":
      return <Badge variant="outline">Low</Badge>
    default:
      return null
  }
}
