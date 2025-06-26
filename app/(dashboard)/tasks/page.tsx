import type { Metadata } from "next"
import { CheckCircle, Clock, AlertTriangle, ListChecks } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TodoList } from "@/components/tasks/todo-list"
import { TodoKanban } from "@/components/tasks/todo-kanban"

export const metadata: Metadata = {
  title: "Tasks",
  description: "Manage your tasks and to-dos",
}

// Demo data for tasks
const demoStats = {
  total: 42,
  completed: 18,
  pending: 24,
  overdue: 5,
  highPriority: 8,
}

const demoTodos = [
  {
    id: "1",
    title: "Complete patient assessment for John Smith",
    description: "Conduct full assessment and update care plan",
    status: "todo",
    priority: "high",
    dueDate: "2023-05-15",
    assignedTo: "Sarah Johnson",
  },
  {
    id: "2",
    title: "Review medication plan for Emily Wilson",
    description: "Check for interactions and update as needed",
    status: "in-progress",
    priority: "medium",
    dueDate: "2023-05-16",
    assignedTo: "Dr. Michael Brown",
  },
  {
    id: "3",
    title: "Schedule follow-up appointment for David Taylor",
    description: "Coordinate with family members for transportation",
    status: "todo",
    priority: "low",
    dueDate: "2023-05-18",
    assignedTo: "Jessica Lee",
  },
  {
    id: "4",
    title: "Update risk assessment for Robert Martin",
    description: "Include recent fall incident in assessment",
    status: "todo",
    priority: "high",
    dueDate: "2023-05-14",
    assignedTo: "Sarah Johnson",
  },
  {
    id: "5",
    title: "Complete training module on new medication protocol",
    description: "Required for all clinical staff",
    status: "done",
    priority: "medium",
    dueDate: "2023-05-10",
    assignedTo: "All Staff",
  },
  {
    id: "6",
    title: "Review and approve care plan changes",
    description: "Changes submitted by care team for three patients",
    status: "in-progress",
    priority: "high",
    dueDate: "2023-05-15",
    assignedTo: "Dr. Michael Brown",
  },
  {
    id: "7",
    title: "Prepare monthly compliance report",
    description: "Include all training completions and policy updates",
    status: "todo",
    priority: "medium",
    dueDate: "2023-05-20",
    assignedTo: "Jessica Lee",
  },
  {
    id: "8",
    title: "Follow up on equipment request for patient P003",
    description: "Check status with procurement team",
    status: "done",
    priority: "low",
    dueDate: "2023-05-12",
    assignedTo: "Robert Martin",
  },
]

export default function TasksPage() {
  // Calculate completion percentage
  const completionPercentage = demoStats.total > 0 ? Math.round((demoStats.completed / demoStats.total) * 100) : 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage your tasks and to-dos</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListChecks className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoStats.total}</div>
            <p className="text-xs text-muted-foreground">{completionPercentage}% completion rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoStats.pending}</div>
            <p className="text-xs text-muted-foreground">{demoStats.highPriority} high priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoStats.completed}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoStats.overdue}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <TodoList todos={demoTodos} />
        </TabsContent>
        <TabsContent value="kanban">
          <TodoKanban todos={demoTodos} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
