import { sql } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import { DEFAULT_TENANT_ID } from "@/lib/constants"
import { redis, generateCacheKey, setCacheWithExpiry, getCacheData, deleteCache } from "@/lib/redis/client"
import { logError } from "@/lib/services/error-logging-service"

export type TaskPriority = "low" | "medium" | "high" | "urgent"
export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled" | "overdue"
export type TaskRecurrence = "none" | "daily" | "weekly" | "biweekly" | "monthly" | "custom"

export interface Task {
  id: string
  tenant_id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  due_date: Date | null
  completion_date: Date | null
  assigned_to: string | null
  assigned_by: string | null
  patient_id: string | null
  care_professional_id: string | null
  category: string
  recurrence: TaskRecurrence
  recurrence_config?: any
  reminder_time?: Date | null
  reminder_sent: boolean
  parent_task_id?: string | null
  related_entity_type?: string | null
  related_entity_id?: string | null
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
  tags?: string[]
  attachments?: string[]
}

export interface TaskFilter {
  status?: TaskStatus | TaskStatus[]
  priority?: TaskPriority | TaskPriority[]
  assigned_to?: string
  patient_id?: string
  care_professional_id?: string
  category?: string
  due_date_start?: Date
  due_date_end?: Date
  search?: string
  tags?: string[]
}

export interface TaskReminderSettings {
  enabled: boolean
  minutes_before: number[]
  notification_channels: ("email" | "sms" | "app")[]
}

// Enhanced Task Service with comprehensive functionality
export const enhancedTaskService = {
  // Create a new task
  async createTask(taskData: Partial<Task>, tenantId: string = DEFAULT_TENANT_ID): Promise<Task> {
    try {
      const taskId = taskData.id || uuidv4()

      const result = await sql`
        INSERT INTO tasks (
          id, tenant_id, title, description, status, priority, 
          due_date, assigned_to, assigned_by, patient_id, 
          care_professional_id, category, recurrence, recurrence_config,
          reminder_time, reminder_sent, parent_task_id, 
          related_entity_type, related_entity_id, tags
        ) VALUES (
          ${taskId}, ${tenantId}, ${taskData.title}, ${taskData.description || ""}, 
          ${taskData.status || "pending"}, ${taskData.priority || "medium"}, 
          ${taskData.due_date}, ${taskData.assigned_to}, ${taskData.assigned_by}, 
          ${taskData.patient_id}, ${taskData.care_professional_id}, 
          ${taskData.category || "general"}, ${taskData.recurrence || "none"}, 
          ${taskData.recurrence_config ? JSON.stringify(taskData.recurrence_config) : null},
          ${taskData.reminder_time}, ${taskData.reminder_sent || false}, 
          ${taskData.parent_task_id}, ${taskData.related_entity_type}, 
          ${taskData.related_entity_id}, ${taskData.tags ? JSON.stringify(taskData.tags) : null}
        )
        RETURNING *
      `

      const task = result[0]

      // Clear cache for related lists
      await this.clearTaskListCache(tenantId, taskData.assigned_to)

      // If this is a recurring task, schedule the next occurrence
      if (taskData.recurrence && taskData.recurrence !== "none") {
        await this.scheduleNextRecurringTask(task)
      }

      return task
    } catch (error) {
      console.error("Error creating task:", error)
      await logError({
        message: `Error creating task: ${error}`,
        componentPath: "lib/services/enhanced-task-service.ts:createTask",
        severity: "high",
      })
      throw error
    }
  },

  // Get a task by ID
  async getTaskById(taskId: string, tenantId: string = DEFAULT_TENANT_ID): Promise<Task | null> {
    try {
      const cacheKey = generateCacheKey(`task:${taskId}`, tenantId)
      const cachedTask = await getCacheData<Task>(cacheKey)

      if (cachedTask) {
        return cachedTask
      }

      const result = await sql`
        SELECT * FROM tasks
        WHERE id = ${taskId}
        AND tenant_id = ${tenantId}
        AND deleted_at IS NULL
      `

      if (result.length === 0) {
        return null
      }

      const task = result[0]

      // Cache the task for 5 minutes
      await setCacheWithExpiry(cacheKey, task, 300)

      return task
    } catch (error) {
      console.error("Error getting task by ID:", error)
      await logError({
        message: `Error getting task by ID: ${error}`,
        componentPath: "lib/services/enhanced-task-service.ts:getTaskById",
        severity: "medium",
      })
      return null
    }
  },

  // Update a task
  async updateTask(
    taskId: string,
    taskData: Partial<Task>,
    tenantId: string = DEFAULT_TENANT_ID,
  ): Promise<Task | null> {
    try {
      // Start building the SQL query
      const updateFields = []
      const updateValues = []
      let paramIndex = 3 // Starting from 3 because $1 is taskId and $2 is tenantId

      // Build the update fields and values
      for (const [key, value] of Object.entries(taskData)) {
        if (
          key !== "id" &&
          key !== "tenant_id" &&
          key !== "created_at" &&
          key !== "updated_at" &&
          key !== "deleted_at"
        ) {
          if (key === "tags" || key === "recurrence_config") {
            updateFields.push(`${key} = $${paramIndex}`)
            updateValues.push(value ? JSON.stringify(value) : null)
          } else {
            updateFields.push(`${key} = $${paramIndex}`)
            updateValues.push(value)
          }
          paramIndex++
        }
      }

      // Add updated_at field
      updateFields.push(`updated_at = NOW()`)

      // Execute the update query
      const query = `
        UPDATE tasks
        SET ${updateFields.join(", ")}
        WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
        RETURNING *
      `

      const result = await sql.query(query, [taskId, tenantId, ...updateValues])

      if (result.rows.length === 0) {
        return null
      }

      const updatedTask = result.rows[0]

      // Clear cache
      const cacheKey = generateCacheKey(`task:${taskId}`, tenantId)
      await deleteCache(cacheKey)
      await this.clearTaskListCache(tenantId, updatedTask.assigned_to)

      // If status changed to completed, update completion_date
      if (taskData.status === "completed" && !taskData.completion_date) {
        await sql`
          UPDATE tasks
          SET completion_date = NOW()
          WHERE id = ${taskId} AND tenant_id = ${tenantId}
        `
        updatedTask.completion_date = new Date()
      }

      // If this is a recurring task and was completed, schedule the next occurrence
      if (updatedTask.recurrence !== "none" && taskData.status === "completed") {
        await this.scheduleNextRecurringTask(updatedTask)
      }

      return updatedTask
    } catch (error) {
      console.error("Error updating task:", error)
      await logError({
        message: `Error updating task: ${error}`,
        componentPath: "lib/services/enhanced-task-service.ts:updateTask",
        severity: "high",
      })
      throw error
    }
  },

  // Delete a task (soft delete)
  async deleteTask(taskId: string, tenantId: string = DEFAULT_TENANT_ID): Promise<boolean> {
    try {
      const task = await this.getTaskById(taskId, tenantId)

      if (!task) {
        return false
      }

      await sql`
        UPDATE tasks
        SET deleted_at = NOW(), updated_at = NOW()
        WHERE id = ${taskId} AND tenant_id = ${tenantId}
      `

      // Clear cache
      const cacheKey = generateCacheKey(`task:${taskId}`, tenantId)
      await deleteCache(cacheKey)
      await this.clearTaskListCache(tenantId, task.assigned_to)

      return true
    } catch (error) {
      console.error("Error deleting task:", error)
      await logError({
        message: `Error deleting task: ${error}`,
        componentPath: "lib/services/enhanced-task-service.ts:deleteTask",
        severity: "high",
      })
      return false
    }
  },

  // Get tasks with filtering, sorting, and pagination
  async getTasks(
    filters: TaskFilter = {},
    sortBy = "due_date",
    sortOrder: "asc" | "desc" = "asc",
    page = 1,
    pageSize = 20,
    tenantId: string = DEFAULT_TENANT_ID,
  ): Promise<{ tasks: Task[]; total: number }> {
    try {
      // Build cache key based on parameters
      const cacheKey = generateCacheKey(
        `tasks:${JSON.stringify(filters)}:${sortBy}:${sortOrder}:${page}:${pageSize}`,
        tenantId,
      )

      // Try to get from cache
      const cachedResult = await getCacheData<{ tasks: Task[]; total: number }>(cacheKey)
      if (cachedResult) {
        return cachedResult
      }

      // Build where clauses
      const whereClauses = [`tenant_id = '${tenantId}'`, "deleted_at IS NULL"]
      const queryParams = []
      const paramIndex = 1

      if (filters.status) {
        if (Array.isArray(filters.status)) {
          whereClauses.push(`status IN (${filters.status.map((s) => `'${s}'`).join(", ")})`)
        } else {
          whereClauses.push(`status = '${filters.status}'`)
        }
      }

      if (filters.priority) {
        if (Array.isArray(filters.priority)) {
          whereClauses.push(`priority IN (${filters.priority.map((p) => `'${p}'`).join(", ")})`)
        } else {
          whereClauses.push(`priority = '${filters.priority}'`)
        }
      }

      if (filters.assigned_to) {
        whereClauses.push(`assigned_to = '${filters.assigned_to}'`)
      }

      if (filters.patient_id) {
        whereClauses.push(`patient_id = '${filters.patient_id}'`)
      }

      if (filters.care_professional_id) {
        whereClauses.push(`care_professional_id = '${filters.care_professional_id}'`)
      }

      if (filters.category) {
        whereClauses.push(`category = '${filters.category}'`)
      }

      if (filters.due_date_start) {
        whereClauses.push(`due_date >= '${filters.due_date_start.toISOString()}'`)
      }

      if (filters.due_date_end) {
        whereClauses.push(`due_date <= '${filters.due_date_end.toISOString()}'`)
      }

      if (filters.search) {
        whereClauses.push(`(
          title ILIKE '%${filters.search}%' OR 
          description ILIKE '%${filters.search}%'
        )`)
      }

      if (filters.tags && filters.tags.length > 0) {
        const tagConditions = filters.tags.map((tag) => `tags @> '["${tag}"]'::jsonb`).join(" OR ")
        whereClauses.push(`(${tagConditions})`)
      }

      // Calculate pagination
      const offset = (page - 1) * pageSize

      // Build and execute the query
      const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : ""

      const countQuery = `
        SELECT COUNT(*) as total
        FROM tasks
        ${whereClause}
      `

      const tasksQuery = `
        SELECT *
        FROM tasks
        ${whereClause}
        ORDER BY ${sortBy} ${sortOrder}
        LIMIT ${pageSize} OFFSET ${offset}
      `

      const [countResult, tasksResult] = await Promise.all([sql.query(countQuery), sql.query(tasksQuery)])

      const total = Number.parseInt(countResult.rows[0].total, 10)
      const tasks = tasksResult.rows

      const result = { tasks, total }

      // Cache the result for 1 minute
      await setCacheWithExpiry(cacheKey, result, 60)

      return result
    } catch (error) {
      console.error("Error getting tasks:", error)
      await logError({
        message: `Error getting tasks: ${error}`,
        componentPath: "lib/services/enhanced-task-service.ts:getTasks",
        severity: "medium",
      })
      return { tasks: [], total: 0 }
    }
  },

  // Get tasks assigned to a specific user
  async getTasksAssignedToUser(
    userId: string,
    filters: Partial<TaskFilter> = {},
    tenantId: string = DEFAULT_TENANT_ID,
  ): Promise<Task[]> {
    try {
      const enhancedFilters: TaskFilter = {
        ...filters,
        assigned_to: userId,
      }

      const { tasks } = await this.getTasks(enhancedFilters, "due_date", "asc", 1, 100, tenantId)
      return tasks
    } catch (error) {
      console.error("Error getting tasks assigned to user:", error)
      await logError({
        message: `Error getting tasks assigned to user: ${error}`,
        componentPath: "lib/services/enhanced-task-service.ts:getTasksAssignedToUser",
        severity: "medium",
      })
      return []
    }
  },

  // Get overdue tasks
  async getOverdueTasks(tenantId: string = DEFAULT_TENANT_ID): Promise<Task[]> {
    try {
      const now = new Date()

      const result = await sql`
        SELECT * FROM tasks
        WHERE tenant_id = ${tenantId}
        AND deleted_at IS NULL
        AND status NOT IN ('completed', 'cancelled')
        AND due_date < ${now.toISOString()}
        ORDER BY due_date ASC
      `

      return result
    } catch (error) {
      console.error("Error getting overdue tasks:", error)
      await logError({
        message: `Error getting overdue tasks: ${error}`,
        componentPath: "lib/services/enhanced-task-service.ts:getOverdueTasks",
        severity: "medium",
      })
      return []
    }
  },

  // Get upcoming tasks due in the next X hours
  async getUpcomingTasks(hoursAhead = 24, tenantId: string = DEFAULT_TENANT_ID): Promise<Task[]> {
    try {
      const now = new Date()
      const futureDate = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000)

      const result = await sql`
        SELECT * FROM tasks
        WHERE tenant_id = ${tenantId}
        AND deleted_at IS NULL
        AND status NOT IN ('completed', 'cancelled')
        AND due_date >= ${now.toISOString()}
        AND due_date <= ${futureDate.toISOString()}
        ORDER BY due_date ASC
      `

      return result
    } catch (error) {
      console.error("Error getting upcoming tasks:", error)
      await logError({
        message: `Error getting upcoming tasks: ${error}`,
        componentPath: "lib/services/enhanced-task-service.ts:getUpcomingTasks",
        severity: "medium",
      })
      return []
    }
  },

  // Get tasks related to a specific entity (patient, care professional, etc.)
  async getRelatedTasks(entityType: string, entityId: string, tenantId: string = DEFAULT_TENANT_ID): Promise<Task[]> {
    try {
      const result = await sql`
        SELECT * FROM tasks
        WHERE tenant_id = ${tenantId}
        AND deleted_at IS NULL
        AND related_entity_type = ${entityType}
        AND related_entity_id = ${entityId}
        ORDER BY due_date ASC
      `

      return result
    } catch (error) {
      console.error("Error getting related tasks:", error)
      await logError({
        message: `Error getting related tasks: ${error}`,
        componentPath: "lib/services/enhanced-task-service.ts:getRelatedTasks",
        severity: "medium",
      })
      return []
    }
  },

  // Assign a task to a user
  async assignTask(
    taskId: string,
    assignedTo: string,
    assignedBy: string,
    tenantId: string = DEFAULT_TENANT_ID,
  ): Promise<Task | null> {
    try {
      const result = await sql`
        UPDATE tasks
        SET assigned_to = ${assignedTo},
            assigned_by = ${assignedBy},
            updated_at = NOW()
        WHERE id = ${taskId}
        AND tenant_id = ${tenantId}
        AND deleted_at IS NULL
        RETURNING *
      `

      if (result.length === 0) {
        return null
      }

      const task = result[0]

      // Clear cache
      const cacheKey = generateCacheKey(`task:${taskId}`, tenantId)
      await deleteCache(cacheKey)
      await this.clearTaskListCache(tenantId, assignedTo)

      return task
    } catch (error) {
      console.error("Error assigning task:", error)
      await logError({
        message: `Error assigning task: ${error}`,
        componentPath: "lib/services/enhanced-task-service.ts:assignTask",
        severity: "high",
      })
      throw error
    }
  },

  // Update task status
  async updateTaskStatus(
    taskId: string,
    status: TaskStatus,
    tenantId: string = DEFAULT_TENANT_ID,
  ): Promise<Task | null> {
    try {
      let updateFields = `status = ${status}, updated_at = NOW()`

      // If marking as completed, set completion date
      if (status === "completed") {
        updateFields += `, completion_date = NOW()`
      }

      const result = await sql.query(
        `
        UPDATE tasks
        SET ${updateFields}
        WHERE id = $1
        AND tenant_id = $2
        AND deleted_at IS NULL
        RETURNING *
      `,
        [taskId, tenantId],
      )

      if (result.rows.length === 0) {
        return null
      }

      const task = result.rows[0]

      // Clear cache
      const cacheKey = generateCacheKey(`task:${taskId}`, tenantId)
      await deleteCache(cacheKey)
      await this.clearTaskListCache(tenantId, task.assigned_to)

      // If this is a recurring task and was completed, schedule the next occurrence
      if (task.recurrence !== "none" && status === "completed") {
        await this.scheduleNextRecurringTask(task)
      }

      return task
    } catch (error) {
      console.error("Error updating task status:", error)
      await logError({
        message: `Error updating task status: ${error}`,
        componentPath: "lib/services/enhanced-task-service.ts:updateTaskStatus",
        severity: "high",
      })
      throw error
    }
  },

  // Schedule the next occurrence of a recurring task
  async scheduleNextRecurringTask(task: Task): Promise<Task | null> {
    try {
      if (!task.recurrence || task.recurrence === "none") {
        return null
      }

      // Calculate the next due date based on recurrence pattern
      const nextDueDate = this.calculateNextDueDate(task)

      if (!nextDueDate) {
        return null
      }

      // Create a new task for the next occurrence
      const newTaskData: Partial<Task> = {
        title: task.title,
        description: task.description,
        status: "pending",
        priority: task.priority,
        due_date: nextDueDate,
        assigned_to: task.assigned_to,
        assigned_by: task.assigned_by,
        patient_id: task.patient_id,
        care_professional_id: task.care_professional_id,
        category: task.category,
        recurrence: task.recurrence,
        recurrence_config: task.recurrence_config,
        reminder_time: task.reminder_time
          ? new Date(nextDueDate.getTime() - (task.due_date!.getTime() - task.reminder_time.getTime()))
          : null,
        reminder_sent: false,
        parent_task_id: task.id,
        related_entity_type: task.related_entity_type,
        related_entity_id: task.related_entity_id,
        tags: task.tags,
      }

      return await this.createTask(newTaskData, task.tenant_id)
    } catch (error) {
      console.error("Error scheduling next recurring task:", error)
      await logError({
        message: `Error scheduling next recurring task: ${error}`,
        componentPath: "lib/services/enhanced-task-service.ts:scheduleNextRecurringTask",
        severity: "medium",
      })
      return null
    }
  },

  // Calculate the next due date based on recurrence pattern
  calculateNextDueDate(task: Task): Date | null {
    if (!task.due_date) {
      return null
    }

    const dueDate = new Date(task.due_date)
    const now = new Date()

    switch (task.recurrence) {
      case "daily":
        return new Date(dueDate.setDate(dueDate.getDate() + 1))

      case "weekly":
        return new Date(dueDate.setDate(dueDate.getDate() + 7))

      case "biweekly":
        return new Date(dueDate.setDate(dueDate.getDate() + 14))

      case "monthly":
        return new Date(dueDate.setMonth(dueDate.getMonth() + 1))

      case "custom":
        if (task.recurrence_config && task.recurrence_config.interval && task.recurrence_config.unit) {
          const { interval, unit } = task.recurrence_config

          switch (unit) {
            case "days":
              return new Date(dueDate.setDate(dueDate.getDate() + interval))

            case "weeks":
              return new Date(dueDate.setDate(dueDate.getDate() + interval * 7))

            case "months":
              return new Date(dueDate.setMonth(dueDate.getMonth() + interval))

            default:
              return null
          }
        }
        return null

      default:
        return null
    }
  },

  // Process reminders for tasks
  async processTaskReminders(tenantId: string = DEFAULT_TENANT_ID): Promise<number> {
    try {
      const now = new Date()
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000)

      // Find tasks with reminders that need to be sent
      const tasksToRemind = await sql`
        SELECT * FROM tasks
        WHERE tenant_id = ${tenantId}
        AND deleted_at IS NULL
        AND status NOT IN ('completed', 'cancelled')
        AND reminder_time IS NOT NULL
        AND reminder_time <= ${fiveMinutesFromNow.toISOString()}
        AND reminder_time >= ${now.toISOString()}
        AND reminder_sent = false
      `

      if (tasksToRemind.length === 0) {
        return 0
      }

      // Process each task reminder
      const reminderPromises = tasksToRemind.map(async (task: Task) => {
        // In a real implementation, this would send notifications via email, SMS, or in-app
        // For now, we'll just mark the reminder as sent
        await sql`
          UPDATE tasks
          SET reminder_sent = true,
              updated_at = NOW()
          WHERE id = ${task.id}
          AND tenant_id = ${tenantId}
        `

        // Clear cache
        const cacheKey = generateCacheKey(`task:${task.id}`, tenantId)
        await deleteCache(cacheKey)

        return task
      })

      const processedReminders = await Promise.all(reminderPromises)
      return processedReminders.length
    } catch (error) {
      console.error("Error processing task reminders:", error)
      await logError({
        message: `Error processing task reminders: ${error}`,
        componentPath: "lib/services/enhanced-task-service.ts:processTaskReminders",
        severity: "medium",
      })
      return 0
    }
  },

  // Mark overdue tasks
  async markOverdueTasks(tenantId: string = DEFAULT_TENANT_ID): Promise<number> {
    try {
      const now = new Date()

      const result = await sql`
        UPDATE tasks
        SET status = 'overdue',
            updated_at = NOW()
        WHERE tenant_id = ${tenantId}
        AND deleted_at IS NULL
        AND status = 'pending'
        AND due_date < ${now.toISOString()}
        RETURNING id
      `

      // Clear cache for all affected tasks
      for (const task of result) {
        const cacheKey = generateCacheKey(`task:${task.id}`, tenantId)
        await deleteCache(cacheKey)
      }

      // Clear list caches
      await this.clearAllTaskListCaches(tenantId)

      return result.length
    } catch (error) {
      console.error("Error marking overdue tasks:", error)
      await logError({
        message: `Error marking overdue tasks: ${error}`,
        componentPath: "lib/services/enhanced-task-service.ts:markOverdueTasks",
        severity: "medium",
      })
      return 0
    }
  },

  // Get task statistics
  async getTaskStatistics(tenantId: string = DEFAULT_TENANT_ID): Promise<any> {
    try {
      const cacheKey = generateCacheKey(`task-statistics`, tenantId)
      const cachedStats = await getCacheData(cacheKey)

      if (cachedStats) {
        return cachedStats
      }

      const [totalTasks, pendingTasks, completedTasks, overdueTasks, highPriorityTasks, todayTasks] = await Promise.all(
        [
          sql`SELECT COUNT(*) as count FROM tasks WHERE tenant_id = ${tenantId} AND deleted_at IS NULL`,
          sql`SELECT COUNT(*) as count FROM tasks WHERE tenant_id = ${tenantId} AND deleted_at IS NULL AND status = 'pending'`,
          sql`SELECT COUNT(*) as count FROM tasks WHERE tenant_id = ${tenantId} AND deleted_at IS NULL AND status = 'completed'`,
          sql`SELECT COUNT(*) as count FROM tasks WHERE tenant_id = ${tenantId} AND deleted_at IS NULL AND status = 'overdue'`,
          sql`SELECT COUNT(*) as count FROM tasks WHERE tenant_id = ${tenantId} AND deleted_at IS NULL AND priority = 'high' AND status NOT IN ('completed', 'cancelled')`,
          sql`
          SELECT COUNT(*) as count 
          FROM tasks 
          WHERE tenant_id = ${tenantId} 
          AND deleted_at IS NULL 
          AND status NOT IN ('completed', 'cancelled')
          AND due_date::date = CURRENT_DATE
        `,
        ],
      )

      const statistics = {
        total: Number.parseInt(totalTasks[0].count, 10),
        pending: Number.parseInt(pendingTasks[0].count, 10),
        completed: Number.parseInt(completedTasks[0].count, 10),
        overdue: Number.parseInt(overdueTasks[0].count, 10),
        highPriority: Number.parseInt(highPriorityTasks[0].count, 10),
        dueToday: Number.parseInt(todayTasks[0].count, 10),
        completionRate:
          totalTasks[0].count > 0
            ? Math.round(
                (Number.parseInt(completedTasks[0].count, 10) / Number.parseInt(totalTasks[0].count, 10)) * 100,
              )
            : 0,
      }

      // Cache for 5 minutes
      await setCacheWithExpiry(cacheKey, statistics, 300)

      return statistics
    } catch (error) {
      console.error("Error getting task statistics:", error)
      await logError({
        message: `Error getting task statistics: ${error}`,
        componentPath: "lib/services/enhanced-task-service.ts:getTaskStatistics",
        severity: "medium",
      })
      return {
        total: 0,
        pending: 0,
        completed: 0,
        overdue: 0,
        highPriority: 0,
        dueToday: 0,
        completionRate: 0,
      }
    }
  },

  // Get task categories with counts
  async getTaskCategories(tenantId: string = DEFAULT_TENANT_ID): Promise<any[]> {
    try {
      const cacheKey = generateCacheKey(`task-categories`, tenantId)
      const cachedCategories = await getCacheData(cacheKey)

      if (cachedCategories) {
        return cachedCategories
      }

      const result = await sql`
        SELECT category, COUNT(*) as count
        FROM tasks
        WHERE tenant_id = ${tenantId}
        AND deleted_at IS NULL
        GROUP BY category
        ORDER BY count DESC
      `

      // Cache for 5 minutes
      await setCacheWithExpiry(cacheKey, result, 300)

      return result
    } catch (error) {
      console.error("Error getting task categories:", error)
      await logError({
        message: `Error getting task categories: ${error}`,
        componentPath: "lib/services/enhanced-task-service.ts:getTaskCategories",
        severity: "medium",
      })
      return []
    }
  },

  // Add a tag to a task
  async addTagToTask(taskId: string, tag: string, tenantId: string = DEFAULT_TENANT_ID): Promise<Task | null> {
    try {
      const task = await this.getTaskById(taskId, tenantId)

      if (!task) {
        return null
      }

      const tags = task.tags || []

      if (!tags.includes(tag)) {
        tags.push(tag)

        const result = await sql`
          UPDATE tasks
          SET tags = ${JSON.stringify(tags)},
              updated_at = NOW()
          WHERE id = ${taskId}
          AND tenant_id = ${tenantId}
          AND deleted_at IS NULL
          RETURNING *
        `

        if (result.length === 0) {
          return null
        }

        // Clear cache
        const cacheKey = generateCacheKey(`task:${taskId}`, tenantId)
        await deleteCache(cacheKey)

        return result[0]
      }

      return task
    } catch (error) {
      console.error("Error adding tag to task:", error)
      await logError({
        message: `Error adding tag to task: ${error}`,
        componentPath: "lib/services/enhanced-task-service.ts:addTagToTask",
        severity: "medium",
      })
      throw error
    }
  },

  // Remove a tag from a task
  async removeTagFromTask(taskId: string, tag: string, tenantId: string = DEFAULT_TENANT_ID): Promise<Task | null> {
    try {
      const task = await this.getTaskById(taskId, tenantId)

      if (!task || !task.tags) {
        return task
      }

      const tags = task.tags.filter((t) => t !== tag)

      const result = await sql`
        UPDATE tasks
        SET tags = ${JSON.stringify(tags)},
            updated_at = NOW()
        WHERE id = ${taskId}
        AND tenant_id = ${tenantId}
        AND deleted_at IS NULL
        RETURNING *
      `

      if (result.length === 0) {
        return null
      }

      // Clear cache
      const cacheKey = generateCacheKey(`task:${taskId}`, tenantId)
      await deleteCache(cacheKey)

      return result[0]
    } catch (error) {
      console.error("Error removing tag from task:", error)
      await logError({
        message: `Error removing tag from task: ${error}`,
        componentPath: "lib/services/enhanced-task-service.ts:removeTagFromTask",
        severity: "medium",
      })
      throw error
    }
  },

  // Clear task list cache
  async clearTaskListCache(tenantId: string, userId?: string): Promise<void> {
    try {
      // Clear general task list cache
      const generalCachePattern = generateCacheKey(`tasks:*`, tenantId)
      const keys = await redis.keys(generalCachePattern)

      if (keys.length > 0) {
        await redis.del(...keys)
      }

      // Clear user-specific task list cache if userId is provided
      if (userId) {
        const userCachePattern = generateCacheKey(`user:${userId}:tasks:*`, tenantId)
        const userKeys = await redis.keys(userCachePattern)

        if (userKeys.length > 0) {
          await redis.del(...userKeys)
        }
      }

      // Clear statistics cache
      const statsCacheKey = generateCacheKey(`task-statistics`, tenantId)
      await deleteCache(statsCacheKey)

      // Clear categories cache
      const categoriesCacheKey = generateCacheKey(`task-categories`, tenantId)
      await deleteCache(categoriesCacheKey)
    } catch (error) {
      console.error("Error clearing task list cache:", error)
    }
  },

  // Clear all task list caches
  async clearAllTaskListCaches(tenantId: string): Promise<void> {
    try {
      // Clear all task-related caches
      const cachePattern = generateCacheKey(`tasks:*`, tenantId)
      const keys = await redis.keys(cachePattern)

      if (keys.length > 0) {
        await redis.del(...keys)
      }

      // Clear user-specific task caches
      const userCachePattern = generateCacheKey(`user:*:tasks:*`, tenantId)
      const userKeys = await redis.keys(userCachePattern)

      if (userKeys.length > 0) {
        await redis.del(...userKeys)
      }

      // Clear statistics cache
      const statsCacheKey = generateCacheKey(`task-statistics`, tenantId)
      await deleteCache(statsCacheKey)

      // Clear categories cache
      const categoriesCacheKey = generateCacheKey(`task-categories`, tenantId)
      await deleteCache(categoriesCacheKey)
    } catch (error) {
      console.error("Error clearing all task list caches:", error)
    }
  },
}

export default enhancedTaskService
