import type { Metadata } from "next"
import { CheckCircle, Clock, AlertTriangle, ListChecks } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TodoKanban } from "@/components/tasks/todo-kanban" // Assuming TodoKanban will be updated to use TaskTable
import { checkDatabaseConnection } from "@/lib/db-check"
import { TaskTable } from "@/components/tasks/task-table"
import { TaskService } from "@/lib/services/task-service"
import { PatientService } from "@/lib/services/patient-service"
import type { Patient } from "@/types"
import { TaskFilterControls } from "@/components/tasks/task-filter-controls" // New component for filters
import { getTasksAction } from "@/lib/actions/task-actions"
import { AppError } from "@/lib/error-handler"
import { CardDescription, CardHeader as CardHeader2 } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Tasks",
  description: "Manage your tasks and to-dos",
}

// This component will fetch data and render the main tasks page
async function TasksPageContent({
  searchParams,
}: {
  searchParams: { patientId?: string; status?: string }
}) {
  const dbConnected = await checkDatabaseConnection().catch(() => false)

  // Fetch real data if connected, otherwise use demo data (for development/fallback)
  let tasks = []
  let patients: Patient[] = []
  let totalTasks = 0
  let completedTasks = 0
  let pendingTasks = 0
  let overdueTasks = 0
  let highPriorityTasks = 0
  const error: string | null = null

  if (dbConnected) {
    try {
      const taskService = await TaskService.create()
      const patientService = await PatientService.create()

      const allTasks = await taskService.getTasks({
        patientId: searchParams.patientId,
        status: searchParams.status as any, // Cast to Task["status"]
      })
      tasks = allTasks

      patients = await patientService.getPatients()

      totalTasks = tasks.length
      completedTasks = tasks.filter((task) => task.status === "completed").length
      pendingTasks = tasks.filter((task) => task.status === "pending" || task.status === "in_progress").length
      overdueTasks = tasks.filter((task) => task.status === "overdue").length
      highPriorityTasks = tasks.filter((task) => task.priority === "high").length
    } catch (error) {
      console.error("Failed to fetch real task data:", error)
      // Fallback to demo data if fetching fails
      // For production, you might want a more robust error handling or display
    }
  }

  // Fallback to demo data if no real data or DB not connected
  if (tasks.length === 0 && !dbConnected) {
    // Demo data for tasks (adjust as needed for patient association)
    tasks = [
      {
        id: "T001",
        title: "Review medication plan",
        description: "Review and update the medication plan for John Doe",
        status: "pending",
        priority: "high",
        dueDate: new Date("2023-06-15"),
        assignedToId: "cp_sarah_johnson",
        patientId: "patient_john_doe",
        tenantId: "tenant_id_1",
        createdAt: new Date(),
        updatedAt: new Date(),
        assignedToName: "Dr. Sarah Johnson",
        patientName: "John Doe",
      },
      {
        id: "T002",
        title: "Schedule follow-up appointment",
        description: "Schedule a follow-up appointment for Jane Smith",
        status: "completed",
        priority: "medium",
        dueDate: new Date("2023-06-10"),
        assignedToId: "cp_nurse_williams",
        patientId: "patient_jane_smith",
        tenantId: "tenant_id_1",
        createdAt: new Date(),
        updatedAt: new Date(),
        assignedToName: "Nurse Williams",
        patientName: "Jane Smith",
      },
      {
        id: "T003",
        title: "Update DBS check",
        description: "Ensure DBS check is up to date for staff member",
        status: "in_progress",
        priority: "medium",
        dueDate: new Date("2023-06-20"),
        assignedToId: "cp_hr_manager",
        patientId: null, // Not patient-related
        tenantId: "tenant_id_1",
        createdAt: new Date(),
        updatedAt: new Date(),
        assignedToName: "HR Manager",
        patientName: null,
      },
      {
        id: "T004",
        title: "Prepare monthly report",
        description: "Prepare the monthly patient outcome report",
        status: "overdue",
        priority: "high",
        dueDate: new Date("2023-06-05"),
        assignedToId: "cp_admin_user",
        patientId: null, // Not patient-related
        tenantId: "tenant_id_1",
        createdAt: new Date(),
        updatedAt: new Date(),
        assignedToName: "Admin User",
        patientName: null,
      },
    ]
    patients = [
      {
        id: "patient_john_doe",
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: new Date("1970-01-01"),
        gender: "Male",
        address: "123 Main St",
        phone: "555-1234",
        email: "john.doe@example.com",
        tenantId: "tenant_id_1",
        createdAt: new Date(),
        updatedAt: new Date(),
        fullName: "John Doe",
      },
      {
        id: "patient_jane_smith",
        firstName: "Jane",
        lastName: "Smith",
        dateOfBirth: new Date("1985-05-10"),
        gender: "Female",
        address: "456 Oak Ave",
        phone: "555-5678",
        email: "jane.smith@example.com",
        tenantId: "tenant_id_1",
        createdAt: new Date(),
        updatedAt: new Date(),
        fullName: "Jane Smith",
      },
    ]
    totalTasks = tasks.length
    completedTasks = tasks.filter((task) => task.status === "completed").length
    pendingTasks = tasks.filter((task) => task.status === "pending" || task.status === "in_progress").length
    overdueTasks = tasks.filter((task) => task.status === "overdue").length
    highPriorityTasks = tasks.filter((task) => task.priority === "high").length
  }

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage your tasks and to-dos</p>
        </div>
      </div>

      {!dbConnected && (
        <div className="mb-4 rounded-md bg-amber-50 p-4 text-amber-800">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm">Using demo data. Database connection is not available.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListChecks className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">{completionPercentage}% completion rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
            <p className="text-xs text-muted-foreground">{highPriorityTasks} high priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueTasks}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <TaskFilterControls patients={patients} />

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <TaskTable
            data={tasks}
            onTaskUpdated={async () => {
              "use server"
            }}
          />
        </TabsContent>
        <TabsContent value="kanban">
          <TodoKanban todos={tasks} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default async function TasksPage() {
  let tasks = []
  let error: string | null = null

  try {
    const result = await getTasksAction()
    if (result.success) {
      tasks = result.data || []
    } else {
      error = result.error || "Failed to load tasks."
    }
  } catch (err) {
    const appError = AppError.fromError(err)
    error = appError.message
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <Card>
        <CardHeader2>
          <CardTitle>Tasks Management</CardTitle>
          <CardDescription>Manage all tasks across your organization.</CardDescription>
        </CardHeader2>
        <CardContent>
          {error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <TaskTable
              initialTasks={tasks}
              onTasksUpdated={() => {
                // This function will trigger a re-render of the page to fetch updated tasks
                // In a real app, you might use SWR/React Query for more granular revalidation
                // For now, revalidatePath will handle it on the server side.
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
