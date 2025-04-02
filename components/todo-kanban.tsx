import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User } from "lucide-react"

interface Todo {
  id: string
  title: string
  description: string
  status: string
  priority: string
  dueDate: string
  assignedTo: string
}

interface TodoKanbanProps {
  todos: Todo[]
}

export function TodoKanban({ todos }: TodoKanbanProps) {
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

  // Filter todos by status
  const todoItems = todos.filter((todo) => todo.status === "todo")
  const inProgressItems = todos.filter((todo) => todo.status === "in-progress")
  const doneItems = todos.filter((todo) => todo.status === "done")

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div>
        <Card>
          <CardHeader className="bg-muted/50 pb-3">
            <CardTitle className="text-sm font-medium">To Do</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="space-y-3">
              {todoItems.map((todo) => (
                <Card key={todo.id} className="cursor-move">
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">{todo.title}</h4>
                        <Badge variant={getPriorityVariant(todo.priority)}>
                          {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{todo.description}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {formatDate(todo.dueDate)}
                        </div>
                        <div className="flex items-center">
                          <User className="mr-1 h-3 w-3" />
                          {todo.assignedTo}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader className="bg-muted/50 pb-3">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="space-y-3">
              {inProgressItems.map((todo) => (
                <Card key={todo.id} className="cursor-move">
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">{todo.title}</h4>
                        <Badge variant={getPriorityVariant(todo.priority)}>
                          {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{todo.description}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {formatDate(todo.dueDate)}
                        </div>
                        <div className="flex items-center">
                          <User className="mr-1 h-3 w-3" />
                          {todo.assignedTo}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader className="bg-muted/50 pb-3">
            <CardTitle className="text-sm font-medium">Done</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="space-y-3">
              {doneItems.map((todo) => (
                <Card key={todo.id} className="cursor-move opacity-60">
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">{todo.title}</h4>
                        <Badge variant={getPriorityVariant(todo.priority)}>
                          {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{todo.description}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {formatDate(todo.dueDate)}
                        </div>
                        <div className="flex items-center">
                          <User className="mr-1 h-3 w-3" />
                          {todo.assignedTo}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

