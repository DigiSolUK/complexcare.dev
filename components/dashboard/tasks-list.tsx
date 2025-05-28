import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { format, parseISO, isToday, isPast, isTomorrow } from "date-fns"

interface TasksListProps {
  tasks: any[] | undefined
  isLoading: boolean
}

export function TasksList({ tasks, isLoading }: TasksListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-[300px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
        ))}
      </div>
    )
  }

  if (!tasks || tasks.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No pending tasks</div>
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      if (isToday(date)) {
        return "Today"
      }
      if (isTomorrow(date)) {
        return "Tomorrow"
      }
      if (isPast(date)) {
        return `Overdue: ${format(date, "MMM d")}`
      }
      return format(date, "MMM d, yyyy")
    } catch (e) {
      return dateString
    }
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{task.title}</p>
            <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Assigned to: {task.assignedTo}</span>
            <span
              className={
                isPast(parseISO(task.dueDate)) && task.status !== "completed" ? "text-red-600 font-medium" : ""
              }
            >
              Due: {formatDate(task.dueDate)}
            </span>
          </div>
          {task.status === "overdue" && <Badge className={getStatusColor(task.status)}>Overdue</Badge>}
        </div>
      ))}
    </div>
  )
}
