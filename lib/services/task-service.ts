import { executeQuery } from "@/lib/db"
import { AppError } from "@/lib/error-handler"
import type { Task, TaskStatus } from "@/types"
import { getCurrentUser } from "@/lib/auth-utils" // Assuming getCurrentUser is available here

// Helper function to build WHERE clauses for filtering
function buildTaskFilterClause(filters: {
  status?: TaskStatus
  patientId?: string
  assigneeId?: string
  dueDateBefore?: Date
  dueDateAfter?: Date
}): { clause: string; params: any[] } {
  const conditions: string[] = ["deleted_at IS NULL"]
  const params: any[] = []
  let paramIndex = 1

  if (filters.status) {
    conditions.push(`status = $${paramIndex++}`)
    params.push(filters.status)
  }
  if (filters.patientId) {
    conditions.push(`patient_id = $${paramIndex++}`)
    params.push(filters.patientId)
  }
  if (filters.assigneeId) {
    conditions.push(`assigned_to_id = $${paramIndex++}`)
    params.push(filters.assigneeId)
  }
  if (filters.dueDateBefore) {
    conditions.push(`due_date <= $${paramIndex++}`)
    params.push(filters.dueDateBefore.toISOString())
  }
  if (filters.dueDateAfter) {
    conditions.push(`due_date >= $${paramIndex++}`)
    params.push(filters.dueDateAfter.toISOString())
  }

  return {
    clause: conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
    params: params,
  }
}

export class TaskService {
  private tenantId: string

  private constructor(tenantId: string) {
    this.tenantId = tenantId
  }

  static async create(): Promise<TaskService> {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      throw new AppError("Unauthorized: Tenant ID not found for TaskService initialization", 401)
    }
    return new TaskService(user.tenantId)
  }

  // Get all tasks for the current tenant
  async getTasks(filters?: {
    status?: TaskStatus
    patientId?: string
    assigneeId?: string
    dueDateBefore?: Date
    dueDateAfter?: Date
  }): Promise<Task[]> {
    try {
      const filter = buildTaskFilterClause(filters || {})
      const tasks = await executeQuery<Task>(
        `SELECT 
          t.*, 
          p.first_name as patient_first_name, p.last_name as patient_last_name,
          cp.first_name as assigned_to_first_name, cp.last_name as assigned_to_last_name
         FROM tasks t
         LEFT JOIN patients p ON t.patient_id = p.id
         LEFT JOIN care_professionals cp ON t.assigned_to_id = cp.id
         WHERE t.tenant_id = $1 ${filter.clause} ORDER BY t.created_at DESC`,
        [this.tenantId, ...filter.params],
      )
      return tasks.map((task) => ({
        ...task,
        patientName:
          task.patient_first_name && task.patient_last_name
            ? `${task.patient_first_name} ${task.patient_last_name}`
            : null,
        assignedToName:
          task.assigned_to_first_name && task.assigned_to_last_name
            ? `${task.assigned_to_first_name} ${task.assigned_to_last_name}`
            : null,
      }))
    } catch (error) {
      console.error(`Error fetching tasks for tenant ${this.tenantId}:`, error)
      throw new AppError("Failed to fetch tasks", 500, false, "high")
    }
  }

  // Get a single task by ID
  async getTaskById(id: string): Promise<Task | null> {
    try {
      const tasks = await executeQuery<Task>(
        `SELECT 
          t.*, 
          p.first_name as patient_first_name, p.last_name as patient_last_name,
          cp.first_name as assigned_to_first_name, cp.last_name as assigned_to_last_name
         FROM tasks t
         LEFT JOIN patients p ON t.patient_id = p.id
         LEFT JOIN care_professionals cp ON t.assigned_to_id = cp.id
         WHERE t.id = $1 AND t.tenant_id = $2 AND t.deleted_at IS NULL LIMIT 1`,
        [id, this.tenantId],
      )
      return tasks.length > 0
        ? {
            ...tasks[0],
            patientName:
              tasks[0].patient_first_name && tasks[0].patient_last_name
                ? `${tasks[0].patient_first_name} ${tasks[0].patient_last_name}`
                : null,
            assignedToName:
              tasks[0].assigned_to_first_name && tasks[0].assigned_to_last_name
                ? `${tasks[0].assigned_to_first_name} ${tasks[0].assigned_to_last_name}`
                : null,
          }
        : null
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error)
      throw new AppError("Failed to fetch task", 500, false, "high")
    }
  }

  // Create a new task
  async createTask(
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "tenantId" | "assignedToName" | "patientName">,
  ): Promise<Task> {
    try {
      const result = await executeQuery<Task>(
        `INSERT INTO tasks (tenant_id, title, description, status, priority, due_date, assigned_to_id, patient_id, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
         RETURNING *`,
        [
          this.tenantId,
          taskData.title,
          taskData.description,
          taskData.status,
          taskData.priority,
          taskData.due_date,
          taskData.assigned_to_id,
          taskData.patient_id,
        ],
      )
      return result[0]
    } catch (error) {
      console.error("Error creating task:", error)
      throw new AppError("Failed to create task", 500, false, "high")
    }
  }

  // Update an existing task
  async updateTask(
    id: string,
    taskData: Partial<Omit<Task, "id" | "createdAt" | "updatedAt" | "tenantId" | "assignedToName" | "patientName">>,
  ): Promise<Task | null> {
    try {
      const fields = Object.keys(taskData)
        .map((key, index) => `${key} = $${index + 3}`) // $1 for id, $2 for tenantId
        .join(", ")
      const values = Object.values(taskData)

      const result = await executeQuery<Task>(
        `UPDATE tasks SET ${fields}, updated_at = NOW() WHERE id = $1 AND tenant_id = $2 RETURNING *`,
        [id, this.tenantId, ...values],
      )
      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.error(`Error updating task with ID ${id}:`, error)
      throw new AppError("Failed to update task", 500, false, "high")
    }
  }

  // Delete a task (soft delete)
  async deleteTask(id: string): Promise<boolean> {
    try {
      const result = await executeQuery(`UPDATE tasks SET deleted_at = NOW() WHERE id = $1 AND tenant_id = $2`, [
        id,
        this.tenantId,
      ])
      return result.rowCount > 0
    } catch (error) {
      console.error(`Error deleting task with ID ${id}:`, error)
      throw new AppError("Failed to delete task", 500, false, "high")
    }
  }

  // Get tasks assigned to a specific user
  async getTasksByAssignee(
    assigneeId: string,
    filters?: {
      status?: TaskStatus
      patientId?: string
      dueDateBefore?: Date
      dueDateAfter?: Date
    },
  ): Promise<Task[]> {
    try {
      const filter = buildTaskFilterClause(filters || {})
      const tasks = await executeQuery<Task>(
        `SELECT 
          t.*, 
          p.first_name as patient_first_name, p.last_name as patient_last_name,
          cp.first_name as assigned_to_first_name, cp.last_name as assigned_to_last_name
         FROM tasks t
         LEFT JOIN patients p ON t.patient_id = p.id
         LEFT JOIN care_professionals cp ON t.assigned_to_id = cp.id
         WHERE t.assigned_to_id = $1 AND t.tenant_id = $2 ${filter.clause} ORDER BY t.created_at DESC`,
        [assigneeId, this.tenantId, ...filter.params],
      )
      return tasks.map((task) => ({
        ...task,
        patientName:
          task.patient_first_name && task.patient_last_name
            ? `${task.patient_first_name} ${task.patient_last_name}`
            : null,
        assignedToName:
          task.assigned_to_first_name && task.assigned_to_last_name
            ? `${task.assigned_to_first_name} ${task.assigned_to_last_name}`
            : null,
      }))
    } catch (error) {
      console.error(`Error fetching tasks for assignee ${assigneeId}:`, error)
      throw new AppError("Failed to fetch tasks by assignee", 500, false, "high")
    }
  }

  // Get tasks by patient ID
  async getTasksByPatient(
    patientId: string,
    filters?: {
      status?: TaskStatus
      assigneeId?: string
      dueDateBefore?: Date
      dueDateAfter?: Date
    },
  ): Promise<Task[]> {
    try {
      const filter = buildTaskFilterClause(filters || {})
      const tasks = await executeQuery<Task>(
        `SELECT 
          t.*, 
          p.first_name as patient_first_name, p.last_name as patient_last_name,
          cp.first_name as assigned_to_first_name, cp.last_name as assigned_to_last_name
         FROM tasks t
         LEFT JOIN patients p ON t.patient_id = p.id
         LEFT JOIN care_professionals cp ON t.assigned_to_id = cp.id
         WHERE t.patient_id = $1 AND t.tenant_id = $2 ${filter.clause} ORDER BY t.created_at DESC`,
        [patientId, this.tenantId, ...filter.params],
      )
      return tasks.map((task) => ({
        ...task,
        patientName:
          task.patient_first_name && task.patient_last_name
            ? `${task.patient_first_name} ${task.patient_last_name}`
            : null,
        assignedToName:
          task.assigned_to_first_name && task.assigned_to_last_name
            ? `${task.assigned_to_first_name} ${task.assigned_to_last_name}`
            : null,
      }))
    } catch (error) {
      console.error(`Error fetching tasks for patient ${patientId}:`, error)
      throw new AppError("Failed to fetch tasks by patient", 500, false, "high")
    }
  }

  // Update task status
  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task | null> {
    try {
      const result = await executeQuery<Task>(
        `UPDATE tasks SET status = $1, updated_at = NOW() WHERE id = $2 AND tenant_id = $3 RETURNING *`,
        [status, id, this.tenantId],
      )
      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.error(`Error updating status for task ${id}:`, error)
      throw new AppError("Failed to update task status", 500, false, "high")
    }
  }
}
