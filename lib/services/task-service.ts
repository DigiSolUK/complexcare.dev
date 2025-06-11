import { getNeonSqlClient } from "@/lib/db"
import type { Task } from "@/types"
import { getCurrentUser } from "@/lib/auth-utils"

// Helper function to get SQL client and tenant ID
async function getServiceDependencies() {
  const user = await getCurrentUser()
  if (!user || !user.tenantId) {
    throw new Error("User not authenticated or tenant not found.")
  }
  const sql = getNeonSqlClient()
  return { sql, tenantId: user.tenantId }
}

export async function getTaskById(id: string): Promise<Task | null> {
  const { sql, tenantId } = await getServiceDependencies()
  const result = await sql`
    SELECT
      t.id,
      t.title,
      t.description,
      t.due_date,
      t.priority,
      t.status,
      t.assigned_to_id,
      t.patient_id,
      t.tenant_id,
      t.created_at,
      t.updated_at,
      cp.first_name || ' ' || cp.last_name AS assigned_to_name,
      p.first_name || ' ' || p.last_name AS patient_name
    FROM tasks t
    LEFT JOIN care_professionals cp ON t.assigned_to_id = cp.id
    LEFT JOIN patients p ON t.patient_id = p.id
    WHERE t.id = ${id} AND t.tenant_id = ${tenantId}
  `
  if (result.length === 0) return null
  const task = result[0]
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    dueDate: task.due_date ? new Date(task.due_date) : null,
    priority: task.priority,
    status: task.status,
    assignedToId: task.assigned_to_id,
    patientId: task.patient_id,
    tenantId: task.tenant_id,
    createdAt: new Date(task.created_at),
    updatedAt: new Date(task.updated_at),
    assignedToName: task.assigned_to_name,
    patientName: task.patient_name,
  }
}

export async function getTasks(filters?: {
  status?: Task["status"]
  assignedToId?: string
  patientId?: string
}): Promise<Task[]> {
  const { sql, tenantId } = await getServiceDependencies()
  let query = `
    SELECT
      t.id,
      t.title,
      t.description,
      t.due_date,
      t.priority,
      t.status,
      t.assigned_to_id,
      t.patient_id,
      t.tenant_id,
      t.created_at,
      t.updated_at,
      cp.first_name || ' ' || cp.last_name AS assigned_to_name,
      p.first_name || ' ' || p.last_name AS patient_name
    FROM tasks t
    LEFT JOIN care_professionals cp ON t.assigned_to_id = cp.id
    LEFT JOIN patients p ON t.patient_id = p.id
    WHERE t.tenant_id = $1
  `
  const params: any[] = [tenantId]

  if (filters?.status) {
    query += ` AND t.status = $${params.length + 1}`
    params.push(filters.status)
  }
  if (filters?.assignedToId) {
    query += ` AND t.assigned_to_id = $${params.length + 1}`
    params.push(filters.assignedToId)
  }
  if (filters?.patientId) {
    query += ` AND t.patient_id = $${params.length + 1}`
    params.push(filters.patientId)
  }

  query += ` ORDER BY t.due_date ASC, t.priority DESC`

  const result = await sql.unsafe(query, params)

  return result.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    dueDate: task.due_date ? new Date(task.due_date) : null,
    priority: task.priority,
    status: task.status,
    assignedToId: task.assigned_to_id,
    patientId: task.patient_id,
    tenantId: task.tenant_id,
    createdAt: new Date(task.created_at),
    updatedAt: new Date(task.updated_at),
    assignedToName: task.assigned_to_name,
    patientName: task.patient_name,
  }))
}

export async function getTasksByAssignee(
  assigneeId: string,
  filters?: { status?: Task["status"]; patientId?: string },
): Promise<Task[]> {
  const { sql, tenantId } = await getServiceDependencies()
  let query = `
    SELECT
      t.id,
      t.title,
      t.description,
      t.due_date,
      t.priority,
      t.status,
      t.assigned_to_id,
      t.patient_id,
      t.tenant_id,
      t.created_at,
      t.updated_at,
      cp.first_name || ' ' || cp.last_name AS assigned_to_name,
      p.first_name || ' ' || p.last_name AS patient_name
    FROM tasks t
    LEFT JOIN care_professionals cp ON t.assigned_to_id = cp.id
    LEFT JOIN patients p ON t.patient_id = p.id
    WHERE t.tenant_id = $1 AND t.assigned_to_id = $2
  `
  const params: any[] = [tenantId, assigneeId]

  if (filters?.status) {
    query += ` AND t.status = $${params.length + 1}`
    params.push(filters.status)
  }
  if (filters?.patientId) {
    query += ` AND t.patient_id = $${params.length + 1}`
    params.push(filters.patientId)
  }

  query += ` ORDER BY t.due_date ASC, t.priority DESC`

  const result = await sql.unsafe(query, params)

  return result.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    dueDate: task.due_date ? new Date(task.due_date) : null,
    priority: task.priority,
    status: task.status,
    assignedToId: task.assigned_to_id,
    patientId: task.patient_id,
    tenantId: task.tenant_id,
    createdAt: new Date(task.created_at),
    updatedAt: new Date(task.updated_at),
    assignedToName: task.assigned_to_name,
    patientName: task.patient_name,
  }))
}

type TaskCreateInput = Omit<Task, "id" | "createdAt" | "updatedAt" | "tenantId" | "assignedToName" | "patientName">
type TaskUpdateInput = Partial<
  Omit<Task, "id" | "createdAt" | "updatedAt" | "tenantId" | "assignedToName" | "patientName">
>

export async function createTask(data: TaskCreateInput): Promise<Task> {
  const { sql, tenantId } = await getServiceDependencies()
  const result = await sql`
    INSERT INTO tasks (
      title,
      description,
      due_date,
      priority,
      status,
      assigned_to_id,
      patient_id,
      tenant_id
    ) VALUES (
      ${data.title},
      ${data.description || null},
      ${data.dueDate ? data.dueDate.toISOString() : null},
      ${data.priority},
      ${data.status},
      ${data.assignedToId || null},
      ${data.patientId || null},
      ${tenantId}
    )
    RETURNING *
  `
  const task = result[0]
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    dueDate: task.due_date ? new Date(task.due_date) : null,
    priority: task.priority,
    status: task.status,
    assignedToId: task.assigned_to_id,
    patientId: task.patient_id,
    tenantId: task.tenant_id,
    createdAt: new Date(task.created_at),
    updatedAt: new Date(task.updated_at),
  }
}

export async function updateTask(id: string, data: TaskUpdateInput): Promise<Task | null> {
  const { sql, tenantId } = await getServiceDependencies()
  const existingTask = await getTaskById(id) // Use the exported function
  if (!existingTask) return null

  const result = await sql`
    UPDATE tasks
    SET
      title = COALESCE(${data.title}, title),
      description = COALESCE(${data.description || null}, description),
      due_date = COALESCE(${data.dueDate ? data.dueDate.toISOString() : null}, due_date),
      priority = COALESCE(${data.priority}, priority),
      status = COALESCE(${data.status}, status),
      assigned_to_id = COALESCE(${data.assignedToId || null}, assigned_to_id),
      patient_id = COALESCE(${data.patientId || null}, patient_id),
      updated_at = NOW()
    WHERE id = ${id} AND tenant_id = ${tenantId}
    RETURNING *
  `
  if (result.length === 0) return null
  const task = result[0]
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    dueDate: task.due_date ? new Date(task.due_date) : null,
    priority: task.priority,
    status: task.status,
    assignedToId: task.assigned_to_id,
    patientId: task.patient_id,
    tenantId: task.tenant_id,
    createdAt: new Date(task.created_at),
    updatedAt: new Date(task.updated_at),
  }
}

export async function deleteTask(id: string): Promise<boolean> {
  const { sql, tenantId } = await getServiceDependencies()
  const result = await sql`
    DELETE FROM tasks
    WHERE id = ${id} AND tenant_id = ${tenantId}
    RETURNING id
  `
  return result.length > 0
}
