import { tenantQuery, tenantInsert, tenantUpdate, tenantDelete } from "@/lib/db-utils"

export type Task = {
  id: string
  tenant_id: string
  title: string
  description: string | null
  status: "pending" | "in_progress" | "completed" | "cancelled" | "overdue"
  priority: "low" | "medium" | "high" | "urgent"
  due_date: string | null
  assigned_to: string | null
  created_by: string
  updated_by: string | null
  related_to_type: string | null
  related_to_id: string | null
  created_at: string
  updated_at: string
  completed_at: string | null
}

// Get all tasks for a tenant
export async function getTasks(tenantId: string): Promise<Task[]> {
  return tenantQuery<Task>(tenantId, `SELECT * FROM tasks ORDER BY due_date ASC`)
}

// Get a task by ID
export async function getTaskById(tenantId: string, taskId: string): Promise<Task | null> {
  const tasks = await tenantQuery<Task>(tenantId, `SELECT * FROM tasks WHERE id = $1`, [taskId])
  return tasks.length > 0 ? tasks[0] : null
}

// Create a new task
export async function createTask(
  tenantId: string,
  taskData: Omit<Task, "id" | "tenant_id" | "created_at" | "updated_at">,
  userId: string,
): Promise<Task> {
  const now = new Date().toISOString()
  const tasks = await tenantInsert<Task>(tenantId, "tasks", {
    ...taskData,
    tenant_id: tenantId,
    created_at: now,
    updated_at: now,
    created_by: userId,
    updated_by: userId,
  })
  return tasks[0]
}

// Update a task
export async function updateTask(
  tenantId: string,
  taskId: string,
  taskData: Partial<Task>,
  userId: string,
): Promise<Task | null> {
  const now = new Date().toISOString()
  const tasks = await tenantUpdate<Task>(tenantId, "tasks", taskId, {
    ...taskData,
    updated_at: now,
    updated_by: userId,
  })
  return tasks.length > 0 ? tasks[0] : null
}

// Delete a task
export async function deleteTask(tenantId: string, taskId: string): Promise<Task | null> {
  const tasks = await tenantDelete<Task>(tenantId, "tasks", taskId)
  return tasks.length > 0 ? tasks[0] : null
}

// Get tasks assigned to a care professional
export async function getTasksForCareProfessional(tenantId: string, careProfessionalId: string): Promise<Task[]> {
  return tenantQuery<Task>(
    tenantId,
    `
    SELECT * FROM tasks 
    WHERE tenant_id = $1 
      AND assigned_to = $2
    ORDER BY due_date ASC
    `,
    [tenantId, careProfessionalId],
  )
}

// Get tasks by assignee
export async function getTasksByAssignee(tenantId: string, assigneeId: string, limit: number): Promise<Task[]> {
  return tenantQuery<Task>(
    tenantId,
    `
    SELECT * FROM tasks 
    WHERE tenant_id = $1 
      AND assigned_to = $2
    ORDER BY due_date ASC, priority DESC
    LIMIT $3
    `,
    [tenantId, assigneeId, limit],
  )
}

// Update task status
export async function updateTodoStatus(
  taskId: string,
  tenantId: string,
  status: "pending" | "in_progress" | "completed" | "cancelled" | "overdue",
  updatedBy: string,
): Promise<void> {
  const now = new Date().toISOString()
  await tenantUpdate<Task>(tenantId, "tasks", taskId, {
    status: status,
    updated_at: now,
    updated_by: updatedBy,
  })
}

