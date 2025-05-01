import { neon } from "@neondatabase/serverless"
import { v4 as uuidv4 } from "uuid"

const sql = neon(process.env.DATABASE_URL!)

// Types for our todo data
export type Todo = {
  id: string
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
  assigned_to_name?: string
  created_by_name?: string
}

export async function getTodos(tenantId: string): Promise<Todo[]> {
  const todos = await sql<Todo[]>`
    SELECT t.id, t.title, t.description, t.status, t.priority, 
           t.due_date, t.assigned_to, t.created_by, t.updated_by, 
           t.related_to_type, t.related_to_id, t.created_at, t.updated_at, t.completed_at,
           CONCAT(a.first_name, ' ', a.last_name) as assigned_to_name,
           CONCAT(c.first_name, ' ', c.last_name) as created_by_name
    FROM todos t
    LEFT JOIN users a ON t.assigned_to = a.id
    LEFT JOIN users c ON t.created_by = c.id
    WHERE t.tenant_id = ${tenantId}
    ORDER BY 
      CASE 
        WHEN t.status = 'completed' OR t.status = 'cancelled' THEN 2
        ELSE 1
      END,
      CASE 
        WHEN t.priority = 'urgent' THEN 1
        WHEN t.priority = 'high' THEN 2
        WHEN t.priority = 'medium' THEN 3
        WHEN t.priority = 'low' THEN 4
        ELSE 5
      END,
      t.due_date ASC NULLS LAST
  `
  return todos
}

export async function getTodoById(id: string, tenantId: string): Promise<Todo | null> {
  const todos = await sql<Todo[]>`
    SELECT t.id, t.title, t.description, t.status, t.priority, 
           t.due_date, t.assigned_to, t.created_by, t.updated_by, 
           t.related_to_type, t.related_to_id, t.created_at, t.updated_at, t.completed_at,
           CONCAT(a.first_name, ' ', a.last_name) as assigned_to_name,
           CONCAT(c.first_name, ' ', c.last_name) as created_by_name
    FROM todos t
    LEFT JOIN users a ON t.assigned_to = a.id
    LEFT JOIN users c ON t.created_by = c.id
    WHERE t.id = ${id} AND t.tenant_id = ${tenantId}
  `
  return todos.length > 0 ? todos[0] : null
}

export async function createTodo(todo: {
  tenant_id: string
  title: string
  description?: string
  status: "pending" | "in_progress" | "completed" | "cancelled" | "overdue"
  priority: "low" | "medium" | "high" | "urgent"
  due_date?: string
  assigned_to?: string
  created_by: string
  related_to_type?: string
  related_to_id?: string
}): Promise<string> {
  const id = uuidv4()
  await sql`
    INSERT INTO todos (
      id, tenant_id, title, description, status, priority, 
      due_date, assigned_to, created_by, updated_by, 
      related_to_type, related_to_id
    ) VALUES (
      ${id}, ${todo.tenant_id}, ${todo.title}, ${todo.description || null}, 
      ${todo.status}, ${todo.priority}, ${todo.due_date || null}, 
      ${todo.assigned_to || null}, ${todo.created_by}, ${todo.created_by}, 
      ${todo.related_to_type || null}, ${todo.related_to_id || null}
    )
  `
  return id
}

export async function updateTodoStatus(
  id: string,
  tenantId: string,
  status: "pending" | "in_progress" | "completed" | "cancelled" | "overdue",
  updatedBy: string,
): Promise<void> {
  const completedAt = status === "completed" ? "CURRENT_TIMESTAMP" : null

  await sql`
    UPDATE todos
    SET status = ${status},
        updated_by = ${updatedBy},
        updated_at = CURRENT_TIMESTAMP,
        completed_at = ${completedAt ? sql`CURRENT_TIMESTAMP` : null}
    WHERE id = ${id} AND tenant_id = ${tenantId}
  `
}

export async function updateTodo(
  id: string,
  tenantId: string,
  updates: {
    title?: string
    description?: string | null
    status?: "pending" | "in_progress" | "completed" | "cancelled" | "overdue"
    priority?: "low" | "medium" | "high" | "urgent"
    due_date?: string | null
    assigned_to?: string | null
    related_to_type?: string | null
    related_to_id?: string | null
  },
  updatedBy: string,
): Promise<void> {
  // Build the SET clause dynamically based on provided updates
  const updateFields: string[] = []
  const values: any[] = []

  if (updates.title !== undefined) {
    updateFields.push("title = $1")
    values.push(updates.title)
  }

  if (updates.description !== undefined) {
    updateFields.push("description = $" + (values.length + 1))
    values.push(updates.description)
  }

  if (updates.status !== undefined) {
    updateFields.push("status = $" + (values.length + 1))
    values.push(updates.status)

    if (updates.status === "completed") {
      updateFields.push("completed_at = CURRENT_TIMESTAMP")
    } else if (updates.status !== "completed" && updates.status !== "cancelled") {
      updateFields.push("completed_at = NULL")
    }
  }

  if (updates.priority !== undefined) {
    updateFields.push("priority = $" + (values.length + 1))
    values.push(updates.priority)
  }

  if (updates.due_date !== undefined) {
    updateFields.push("due_date = $" + (values.length + 1))
    values.push(updates.due_date)
  }

  if (updates.assigned_to !== undefined) {
    updateFields.push("assigned_to = $" + (values.length + 1))
    values.push(updates.assigned_to)
  }

  if (updates.related_to_type !== undefined) {
    updateFields.push("related_to_type = $" + (values.length + 1))
    values.push(updates.related_to_type)
  }

  if (updates.related_to_id !== undefined) {
    updateFields.push("related_to_id = $" + (values.length + 1))
    values.push(updates.related_to_id)
  }

  // Always update these fields
  updateFields.push("updated_by = $" + (values.length + 1))
  values.push(updatedBy)

  updateFields.push("updated_at = CURRENT_TIMESTAMP")

  if (updateFields.length === 0) {
    return // Nothing to update
  }

  // Construct and execute the query
  const query = `
    UPDATE todos
    SET ${updateFields.join(", ")}
    WHERE id = $${values.length + 1} AND tenant_id = $${values.length + 2}
  `

  values.push(id)
  values.push(tenantId)

  await sql.query(query, values)
}

export async function deleteTodo(id: string, tenantId: string): Promise<void> {
  await sql`
    DELETE FROM todos
    WHERE id = ${id} AND tenant_id = ${tenantId}
  `
}

export async function getTodosByAssignee(assigneeId: string, tenantId: string): Promise<Todo[]> {
  const todos = await sql<Todo[]>`
    SELECT t.id, t.title, t.description, t.status, t.priority, 
           t.due_date, t.assigned_to, t.created_by, t.updated_by, 
           t.related_to_type, t.related_to_id, t.created_at, t.updated_at, t.completed_at,
           CONCAT(a.first_name, ' ', a.last_name) as assigned_to_name,
           CONCAT(c.first_name, ' ', c.last_name) as created_by_name
    FROM todos t
    LEFT JOIN users a ON t.assigned_to = a.id
    LEFT JOIN users c ON t.created_by = c.id
    WHERE t.assigned_to = ${assigneeId} AND t.tenant_id = ${tenantId}
    AND t.status NOT IN ('completed', 'cancelled')
    ORDER BY 
      CASE 
        WHEN t.priority = 'urgent' THEN 1
        WHEN t.priority = 'high' THEN 2
        WHEN t.priority = 'medium' THEN 3
        WHEN t.priority = 'low' THEN 4
        ELSE 5
      END,
      t.due_date ASC NULLS LAST
  `
  return todos
}

export async function getOverdueTodos(tenantId: string): Promise<Todo[]> {
  const todos = await sql<Todo[]>`
    SELECT t.id, t.title, t.description, t.status, t.priority, 
           t.due_date, t.assigned_to, t.created_by, t.updated_by, 
           t.related_to_type, t.related_to_id, t.created_at, t.updated_at, t.completed_at,
           CONCAT(a.first_name, ' ', a.last_name) as assigned_to_name,
           CONCAT(c.first_name, ' ', c.last_name) as created_by_name
    FROM todos t
    LEFT JOIN users a ON t.assigned_to = a.id
    LEFT JOIN users c ON t.created_by = c.id
    WHERE t.tenant_id = ${tenantId}
    AND t.due_date < CURRENT_TIMESTAMP
    AND t.status NOT IN ('completed', 'cancelled')
    ORDER BY t.due_date ASC
  `
  return todos
}

export async function getTodoStats(tenantId: string): Promise<{
  total: number
  completed: number
  pending: number
  overdue: number
  highPriority: number
}> {
  const stats = await sql`
    SELECT
      COUNT(*) as total,
      COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
      COUNT(CASE WHEN status IN ('pending', 'in_progress') THEN 1 END) as pending,
      COUNT(CASE WHEN due_date < CURRENT_TIMESTAMP AND status NOT IN ('completed', 'cancelled') THEN 1 END) as overdue,
      COUNT(CASE WHEN priority IN ('high', 'urgent') AND status NOT IN ('completed', 'cancelled') THEN 1 END) as high_priority
    FROM todos
    WHERE tenant_id = ${tenantId}
  `

  return {
    total: Number.parseInt(stats[0].total),
    completed: Number.parseInt(stats[0].completed),
    pending: Number.parseInt(stats[0].pending),
    overdue: Number.parseInt(stats[0].overdue),
    highPriority: Number.parseInt(stats[0].high_priority),
  }
}
