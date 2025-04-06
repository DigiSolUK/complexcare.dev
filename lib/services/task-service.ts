import type { Task } from "@/types/task"
import { sql } from "@/lib/db"

// Mock tasks data
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Complete patient assessment",
    description: "Perform initial assessment for new patient John Smith",
    status: "pending",
    priority: "high",
    dueDate: "2023-04-15",
    assignedTo: "cp1", // Sarah Johnson
    patientId: "p1",
    createdAt: "2023-04-01T10:00:00Z",
    updatedAt: "2023-04-01T10:00:00Z",
  },
  {
    id: "2",
    title: "Update care plan",
    description: "Review and update care plan for Emily Wilson",
    status: "in-progress",
    priority: "medium",
    dueDate: "2023-04-10",
    assignedTo: "cp3", // Emily Brown
    patientId: "p4",
    createdAt: "2023-04-02T09:30:00Z",
    updatedAt: "2023-04-03T14:15:00Z",
  },
  {
    id: "3",
    title: "Medication review",
    description: "Conduct quarterly medication review for David Taylor",
    status: "completed",
    priority: "medium",
    dueDate: "2023-04-05",
    assignedTo: "cp1", // Sarah Johnson
    patientId: "p5",
    createdAt: "2023-04-01T11:45:00Z",
    updatedAt: "2023-04-05T16:30:00Z",
  },
  {
    id: "4",
    title: "Follow-up call",
    description: "Call Robert Martin to check on progress after last visit",
    status: "pending",
    priority: "low",
    dueDate: "2023-04-12",
    assignedTo: "cp2", // James Williams
    patientId: "p7",
    createdAt: "2023-04-03T13:20:00Z",
    updatedAt: "2023-04-03T13:20:00Z",
  },
  {
    id: "5",
    title: "Equipment assessment",
    description: "Assess need for mobility equipment for Sarah Johnson",
    status: "in-progress",
    priority: "high",
    dueDate: "2023-04-08",
    assignedTo: "cp4", // Robert Smith
    patientId: "p2",
    createdAt: "2023-04-02T15:10:00Z",
    updatedAt: "2023-04-04T09:45:00Z",
  },
]

export async function getTasks(): Promise<Task[]> {
  try {
    // In a real app, this would fetch from a database
    // For now, return mock data
    return mockTasks
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return [] // Return empty array in case of error
  }
}

export async function getTaskById(id: string): Promise<Task | null> {
  try {
    // In a real app, this would fetch from a database
    // For now, return mock data
    const task = mockTasks.find((task) => task.id === id)
    return task || null
  } catch (error) {
    console.error("Error fetching task:", error)
    return null
  }
}

export async function createTask(task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> {
  try {
    // In a real app, this would create a task in the database
    // For now, return a mock task with a generated ID
    const newTask: Task = {
      ...task,
      id: `${mockTasks.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return newTask
  } catch (error) {
    console.error("Error creating task:", error)
    throw error
  }
}

export async function updateTask(id: string, task: Partial<Task>): Promise<Task> {
  try {
    // In a real app, this would update a task in the database
    // For now, return a mock task
    const existingTask = mockTasks.find((t) => t.id === id)
    if (!existingTask) {
      throw new Error(`Task with ID ${id} not found`)
    }
    const updatedTask: Task = {
      ...existingTask,
      ...task,
      updatedAt: new Date().toISOString(),
    }
    return updatedTask
  } catch (error) {
    console.error("Error updating task:", error)
    throw error
  }
}

export async function deleteTask(id: string): Promise<void> {
  try {
    // In a real app, this would delete a task from the database
    // For now, do nothing
  } catch (error) {
    console.error("Error deleting task:", error)
    throw error
  }
}

// Add the missing exports
export async function getTasksByAssignee(assigneeId: string): Promise<Task[]> {
  try {
    // In a real app, this would fetch from a database
    // For now, filter mock data
    return mockTasks.filter((task) => task.assignedTo === assigneeId)
  } catch (error) {
    console.error("Error fetching tasks by assignee:", error)
    return [] // Return empty array in case of error
  }
}

export async function getTasksForCareProfessional(careProfessionalId: string): Promise<Task[]> {
  try {
    // In a real app, this would fetch from a database
    // For now, filter mock data
    return mockTasks.filter((task) => task.assignedTo === careProfessionalId)
  } catch (error) {
    console.error("Error fetching tasks for care professional:", error)
    return [] // Return empty array in case of error
  }
}

// Helper function to map database task to Task type
function mapDbTaskToTask(dbTask: any): Task {
  return {
    id: dbTask.id,
    title: dbTask.title,
    description: dbTask.description,
    status: dbTask.status,
    priority: dbTask.priority,
    dueDate: dbTask.due_date,
    assignedTo: dbTask.assigned_to,
    tenantId: dbTask.tenant_id,
    createdAt: dbTask.created_at,
    updatedAt: dbTask.updated_at,
  }
}

export async function getTaskStats(tenantId: string) {
  try {
    if (process.env.DATABASE_URL) {
      const result = await sql`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
          COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue,
          COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority
        FROM tasks
        WHERE tenant_id = ${tenantId}
      `

      return {
        total: Number.parseInt(result.rows[0].total) || 0,
        pending: Number.parseInt(result.rows[0].pending) || 0,
        completed: Number.parseInt(result.rows[0].completed) || 0,
        overdue: Number.parseInt(result.rows[0].overdue) || 0,
        highPriority: Number.parseInt(result.rows[0].high_priority) || 0,
      }
    }

    // Fallback for demo
    return {
      total: 42,
      pending: 24,
      completed: 18,
      overdue: 5,
      highPriority: 8,
    }
  } catch (error) {
    console.error("Error fetching task stats:", error)
    return {
      total: 42,
      pending: 24,
      completed: 18,
      overdue: 5,
      highPriority: 8,
    }
  }
}

