"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, Check, Clock, X, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { type Todo, updateTodoStatus } from "@/lib/services/todo-service"
import { CreateTodoDialog } from "./create-todo-dialog"

interface TodoListProps {
  todos: Todo[]
}

export function TodoList({ todos }: TodoListProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-GB", options)
  }

  // Function to get priority badge variant
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  // Filter todos based on search term, status, and priority
  const filteredTodos = todos.filter((todo) => {
    const matchesSearch =
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (todo.assigned_to_name && todo.assigned_to_name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || todo.status === statusFilter

    const matchesPriority = priorityFilter === "all" || todo.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  // Handle todo status change
  const handleStatusChange = async (id: string, status: "pending" | "in_progress" | "completed" | "cancelled") => {
    try {
      // In a real app, you would get the user ID from the session
      const userId = "18c25ac5-1e96-49f8-9eac-26dc1771230f" // Administrator User
      const tenantId = "ba367cfe-6de0-4180-9566-1002b75cf82c" // ComplexCare Medical Group

      await updateTodoStatus(id, tenantId, status, userId)
      router.refresh()
    } catch (error) {
      console.error("Failed to update todo status:", error)
    }
  }

  // Handle todo creation
  const handleTodoCreated = () => {
    setIsCreateDialogOpen(false)
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task List</CardTitle>
        <CardDescription>Manage and track your tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tasks..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select defaultValue="all" value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all" value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="w-12 p-3 text-center"></th>
                  <th className="p-3 text-left font-medium">Task</th>
                  <th className="p-3 text-left font-medium">Priority</th>
                  <th className="p-3 text-left font-medium">Due Date</th>
                  <th className="p-3 text-left font-medium">Assigned To</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTodos.length === 0 ? (
                  <tr className="border-b">
                    <td colSpan={7} className="p-3 text-center text-muted-foreground">
                      No tasks found
                    </td>
                  </tr>
                ) : (
                  filteredTodos.map((todo) => (
                    <tr key={todo.id} className="border-b">
                      <td className="p-3 text-center">
                        <Checkbox
                          checked={todo.status === "completed"}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleStatusChange(todo.id, "completed")
                            } else {
                              handleStatusChange(todo.id, "pending")
                            }
                          }}
                          disabled={todo.status === "cancelled"}
                        />
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{todo.title}</div>
                        {todo.description && <div className="text-sm text-muted-foreground">{todo.description}</div>}
                      </td>
                      <td className="p-3">
                        <PriorityBadge priority={todo.priority} />
                      </td>
                      <td className="p-3">
                        {todo.due_date ? new Date(todo.due_date).toLocaleDateString() : "No due date"}
                      </td>
                      <td className="p-3">{todo.assigned_to_name || "Unassigned"}</td>
                      <td className="p-3">
                        <StatusBadge status={todo.status} />
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          {todo.status !== "completed" && todo.status !== "cancelled" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusChange(todo.id, "completed")}
                              >
                                <Check className="h-4 w-4 text-green-500" />
                              </Button>
                              {todo.status === "pending" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStatusChange(todo.id, "in_progress")}
                                >
                                  <Clock className="h-4 w-4 text-blue-500" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusChange(todo.id, "cancelled")}
                              >
                                <X className="h-4 w-4 text-red-500" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>

      <CreateTodoDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onTodoCreated={handleTodoCreated}
      />
    </Card>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  let bgColor = "bg-blue-100"
  let textColor = "text-blue-800"

  switch (priority) {
    case "urgent":
      bgColor = "bg-red-100"
      textColor = "text-red-800"
      break
    case "high":
      bgColor = "bg-orange-100"
      textColor = "text-orange-800"
      break
    case "medium":
      bgColor = "bg-blue-100"
      textColor = "text-blue-800"
      break
    case "low":
      bgColor = "bg-green-100"
      textColor = "text-green-800"
      break
    default:
      bgColor = "bg-gray-100"
      textColor = "text-gray-800"
  }

  return (
    <span className={`inline-flex items-center rounded-full ${bgColor} px-2.5 py-0.5 text-xs font-medium ${textColor}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  let bgColor = "bg-blue-100"
  let textColor = "text-blue-800"
  let icon = null

  switch (status) {
    case "pending":
      bgColor = "bg-yellow-100"
      textColor = "text-yellow-800"
      icon = <Clock className="mr-1 h-3 w-3" />
      break
    case "in_progress":
      bgColor = "bg-blue-100"
      textColor = "text-blue-800"
      break
    case "completed":
      bgColor = "bg-green-100"
      textColor = "text-green-800"
      icon = <Check className="mr-1 h-3 w-3" />
      break
    case "cancelled":
      bgColor = "bg-gray-100"
      textColor = "text-gray-800"
      icon = <X className="mr-1 h-3 w-3" />
      break
    case "overdue":
      bgColor = "bg-red-100"
      textColor = "text-red-800"
      icon = <AlertTriangle className="mr-1 h-3 w-3" />
      break
    default:
      bgColor = "bg-gray-100"
      textColor = "text-gray-800"
  }

  return (
    <span className={`inline-flex items-center rounded-full ${bgColor} px-2.5 py-0.5 text-xs font-medium ${textColor}`}>
      {icon}
      {status
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")}
    </span>
  )
}

