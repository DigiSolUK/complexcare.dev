import { sql } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

export interface Task {
  id: string
  tenant_id: string
  title: string
  description?: string
  status: string
  priority: string
  due_date?: Date
  created_at: Date
  updated_at: Date
  created_by?: string
  assigned_to?: string
  category?: string
  completion_date?: Date
  recurring?: boolean
  recurrence_pattern?: string
  related_entity_type?: string
  related_entity_id?: string
  tags?: string[]
}

export interface TaskComment {
  id: string
  tenant_id: string
  task_id: string
  comment: string
  created_by: string
  created_at: Date
}

export interface TaskReminder {
  id: string
  tenant_id: string
  task_id: string
  time: Date
  sent: boolean
  sent_at?: Date
  created_at: Date
}

export const tasksService = {
  // Create a new task
  async createTask(task: Partial<Task>, tenantId: string = DEFAULT_TENANT_ID): Promise<Task> {
    const taskId = uuidv4()
    const now = new Date()

    const result = await sql`
      INSERT INTO tasks (
        id, tenant_id, title, description, status, priority,
        due_date, created_at, updated_at, created_by, assigned_to,
        category, recurring, recurrence_pattern, related_entity_type,
        related_entity_id, tags
      ) VALUES (
        ${taskId}, ${tenantId}, ${task.title}, ${task.description || null},
        ${task.status || "pending"}, ${task.priority || "medium"},
        ${task.due_date || null}, ${now}, ${now}, ${task.created_by || null},
        ${task.assigned_to || null}, ${task.category || null},
        ${task.recurring || false}, ${task.recurrence_pattern || null},
        ${task.related_entity_type || null}, ${task.related_entity_id || null},
        ${task.tags ? JSON.stringify(task.tags) : null}
      )
      RETURNING *
    `

    return result[0]
  },

  // Get tasks with filters
  async getTasks(
    filters: {
      status?: string
      priority?: string
      assigned_to?: string
      category?: string
      search?: string
    } = {},
    tenantId: string = DEFAULT_TENANT_ID,
  ): Promise<Task[]> {
    let query = sql`
      SELECT * FROM tasks
      WHERE tenant_id = ${tenantId}
    `

    if (filters.status) {
      query = sql`${query} AND status = ${filters.status}`
    }
    if (filters.priority) {
      query = sql`${query} AND priority = ${filters.priority}`
    }
    if (filters.assigned_to) {
      query = sql`${query} AND assigned_to = ${filters.assigned_to}`
    }
    if (filters.category) {
      query = sql`${query} AND category = ${filters.category}`
    }
    if (filters.search) {
      query = sql`${query} AND (title ILIKE ${"%" + filters.search + "%"} OR description ILIKE ${"%" + filters.search + "%"})`
    }

    query = sql`${query} ORDER BY due_date ASC, created_at DESC`

    return await query
  },

  // Get task by ID
  async getTaskById(taskId: string, tenantId: string = DEFAULT_TENANT_ID): Promise<Task | null> {
    const result = await sql`
      SELECT * FROM tasks
      WHERE id = ${taskId} AND tenant_id = ${tenantId}
    `

    return result[0] || null
  },

  // Update task
  async updateTask(taskId: string, updates: Partial<Task>, tenantId: string = DEFAULT_TENANT_ID): Promise<Task | null> {
    const result = await sql`
      UPDATE tasks
      SET
        title = COALESCE(${updates.title}, title),
        description = COALESCE(${updates.description}, description),
        status = COALESCE(${updates.status}, status),
        priority = COALESCE(${updates.priority}, priority),
        due_date = COALESCE(${updates.due_date}, due_date),
        assigned_to = COALESCE(${updates.assigned_to}, assigned_to),
        category = COALESCE(${updates.category}, category),
        completion_date = COALESCE(${updates.completion_date}, completion_date),
        tags = COALESCE(${updates.tags ? JSON.stringify(updates.tags) : null}, tags),
        updated_at = NOW()
      WHERE id = ${taskId} AND tenant_id = ${tenantId}
      RETURNING *
    `

    return result[0] || null
  },

  // Add comment to task
  async addComment(
    taskId: string,
    comment: string,
    userId: string,
    tenantId: string = DEFAULT_TENANT_ID,
  ): Promise<TaskComment> {
    const commentId = uuidv4()

    const result = await sql`
      INSERT INTO task_comments (id, tenant_id, task_id, comment, created_by, created_at)
      VALUES (${commentId}, ${tenantId}, ${taskId}, ${comment}, ${userId}, NOW())
      RETURNING *
    `

    return result[0]
  },

  // Get task comments
  async getTaskComments(taskId: string, tenantId: string = DEFAULT_TENANT_ID): Promise<TaskComment[]> {
    return await sql`
      SELECT tc.*, u.name as created_by_name
      FROM task_comments tc
      LEFT JOIN users u ON tc.created_by = u.id
      WHERE tc.task_id = ${taskId} AND tc.tenant_id = ${tenantId}
      ORDER BY tc.created_at DESC
    `
  },

  // Create reminder
  async createReminder(
    taskId: string,
    reminderTime: Date,
    tenantId: string = DEFAULT_TENANT_ID,
  ): Promise<TaskReminder> {
    const reminderId = uuidv4()

    const result = await sql`
      INSERT INTO reminders (id, tenant_id, task_id, time, sent, created_at)
      VALUES (${reminderId}, ${tenantId}, ${taskId}, ${reminderTime}, false, NOW())
      RETURNING *
    `

    return result[0]
  },

  // Get pending reminders
  async getPendingReminders(tenantId: string = DEFAULT_TENANT_ID): Promise<TaskReminder[]> {
    return await sql`
      SELECT r.*, t.title as task_title, t.assigned_to
      FROM reminders r
      JOIN tasks t ON r.task_id = t.id
      WHERE r.tenant_id = ${tenantId}
      AND r.sent = false
      AND r.time <= NOW()
    `
  },

  // Mark reminder as sent
  async markReminderSent(reminderId: string, tenantId: string = DEFAULT_TENANT_ID): Promise<void> {
    await sql`
      UPDATE reminders
      SET sent = true, sent_at = NOW()
      WHERE id = ${reminderId} AND tenant_id = ${tenantId}
    `
  },
}
