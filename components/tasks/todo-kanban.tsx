"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, PlusCircle, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreateTodoDialog } from "./create-todo-dialog"
import { TaskService } from "@/lib/services/task-service"
import { useToast } from "@/components/ui/use-toast"
import type { Task } from "@/types"
import { updateTask, deleteTask } from "@/lib/actions/task-actions"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

interface TodoKanbanProps {
  todos: Task[] // Now receives tasks as props
}

type KanbanColumn = {
  id: Task["status"]
  title: string
  tasks: Task[]
}

export function TodoKanban({ todos }: TodoKanbanProps) {
  const [columns, setColumns] = useState<KanbanColumn[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  const refreshTasks = async () => {
    setIsLoading(true)
    try {
      const taskService = await TaskService.create()
      const fetchedTasks = await taskService.getTasks()
      groupTasksIntoColumns(fetchedTasks)
    } catch (error) {
      console.error("Failed to refresh tasks:", error)
      toast({
        title: "Error",
        description: "Failed to load tasks for Kanban board.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    groupTasksIntoColumns(todos)
  }, [todos])

  const groupTasksIntoColumns = (tasks: Task[]) => {
    const newColumns: KanbanColumn[] = [
      { id: "pending", title: "Pending", tasks: [] },
      { id: "in_progress", title: "In Progress", tasks: [] },
      { id: "completed", title: "Completed", tasks: [] },
      { id: "overdue", title: "Overdue", tasks: [] },
    ]

    tasks.forEach((task) => {
      const column = newColumns.find((col) => col.id === task.status)
      if (column) {
        column.tasks.push(task)
      }
    })

    setColumns(newColumns)
  }

  const getPriorityBadge = (priority: Task["priority"]) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "secondary"
    if (priority === "high") variant = "destructive"
    if (priority === "medium") variant = "default"
    return <Badge variant={variant}>{priority}</Badge>
  }

  const handleStatusChange = async (taskId: string, newStatus: Task["status"]) => {
    const result = await updateTask(taskId, { status: newStatus })
    if (result.success) {
      toast({ title: "Success", description: `Task status updated to ${newStatus}.` })
      refreshTasks()
    } else {
      toast({ title: "Error", description: result.error || "Failed to update task status.", variant: "destructive" })
    }
  }

  const handleDeleteClick = (taskId: string) => {
    setTaskToDelete(taskId)
    setIsConfirmDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      const result = await deleteTask(taskToDelete)
      if (result.success) {
        toast({ title: "Success", description: "Task deleted successfully." })
        refreshTasks()
      } else {
        toast({ title: "Error", description: result.error || "Failed to delete task.", variant: "destructive" })
      }
      setTaskToDelete(null)
      setIsConfirmDeleteDialogOpen(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Task
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="ml-2">Loading Kanban board...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((column) => (
            <Card key={column.id} className="flex flex-col h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">{column.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-3">
                {column.tasks.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No tasks in this column.</p>
                ) : (
                  column.tasks.map((task) => (
                    <Card key={task.id} className="bg-card shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-base">{task.title}</h4>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(task.id)}>
                                Copy task ID
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleStatusChange(task.id, "in_progress")}>
                                Mark In Progress
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(task.id, "completed")}>
                                Mark Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteClick(task.id)}>
                                Delete Task
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
                          {task.patientName && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              Patient: {task.patientName}
                            </Badge>
                          )}
                          {task.assignedToName && (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              Assigned: {task.assignedToName}
                            </Badge>
                          )}
                          {task.dueDate && (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </Badge>
                          )}
                          {getPriorityBadge(task.priority)}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <CreateTodoDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onTaskCreated={refreshTasks} />
      <ConfirmDialog
        open={isConfirmDeleteDialogOpen}
        onOpenChange={setIsConfirmDeleteDialogOpen}
        title="Confirm Deletion"
        description="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
