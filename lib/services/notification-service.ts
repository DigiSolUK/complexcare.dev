import { sql } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

export interface Notification {
  id: string
  tenant_id: string
  user_id: string
  type: string
  title: string
  message: string
  read: boolean
  read_at?: Date
  action_url?: string
  metadata?: any
  created_at: Date
}

export const notificationService = {
  // Create a notification
  async createNotification(
    notification: Omit<Notification, "id" | "created_at" | "read" | "read_at">,
    tenantId: string = DEFAULT_TENANT_ID,
  ): Promise<Notification> {
    const notificationId = uuidv4()

    const result = await sql`
      INSERT INTO notifications (
        id, tenant_id, user_id, type, title, message,
        read, action_url, metadata, created_at
      ) VALUES (
        ${notificationId}, ${tenantId}, ${notification.user_id},
        ${notification.type}, ${notification.title}, ${notification.message},
        false, ${notification.action_url || null},
        ${notification.metadata ? JSON.stringify(notification.metadata) : null},
        NOW()
      )
      RETURNING *
    `

    return result[0]
  },

  // Get notifications for a user
  async getUserNotifications(
    userId: string,
    limit = 20,
    offset = 0,
    tenantId: string = DEFAULT_TENANT_ID,
  ): Promise<Notification[]> {
    return await sql`
      SELECT * FROM notifications
      WHERE tenant_id = ${tenantId} AND user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `
  },

  // Get unread notification count
  async getUnreadCount(userId: string, tenantId: string = DEFAULT_TENANT_ID): Promise<number> {
    const result = await sql`
      SELECT COUNT(*) as count FROM notifications
      WHERE tenant_id = ${tenantId} AND user_id = ${userId} AND read = false
    `

    return Number.parseInt(result[0].count)
  },

  // Mark notification as read
  async markAsRead(notificationId: string, tenantId: string = DEFAULT_TENANT_ID): Promise<void> {
    await sql`
      UPDATE notifications
      SET read = true, read_at = NOW()
      WHERE id = ${notificationId} AND tenant_id = ${tenantId}
    `
  },

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string, tenantId: string = DEFAULT_TENANT_ID): Promise<void> {
    await sql`
      UPDATE notifications
      SET read = true, read_at = NOW()
      WHERE tenant_id = ${tenantId} AND user_id = ${userId} AND read = false
    `
  },

  // Send notification to multiple users
  async sendBulkNotifications(
    userIds: string[],
    notification: Omit<Notification, "id" | "created_at" | "read" | "read_at" | "user_id">,
    tenantId: string = DEFAULT_TENANT_ID,
  ): Promise<void> {
    const notifications = userIds.map((userId) => ({
      id: uuidv4(),
      tenant_id: tenantId,
      user_id: userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      read: false,
      action_url: notification.action_url || null,
      metadata: notification.metadata ? JSON.stringify(notification.metadata) : null,
      created_at: new Date(),
    }))

    if (notifications.length > 0) {
      await sql`
        INSERT INTO notifications ${sql(notifications)}
      `
    }
  },

  // Create notification templates
  async createAppointmentReminder(
    userId: string,
    appointmentData: any,
    tenantId: string = DEFAULT_TENANT_ID,
  ): Promise<Notification> {
    return await this.createNotification(
      {
        user_id: userId,
        type: "appointment_reminder",
        title: "Upcoming Appointment",
        message: `You have an appointment with ${appointmentData.provider} on ${appointmentData.date} at ${appointmentData.time}`,
        action_url: `/portal/appointments/${appointmentData.id}`,
        metadata: appointmentData,
        tenant_id: tenantId,
      },
      tenantId,
    )
  },

  async createMedicationReminder(
    userId: string,
    medicationData: any,
    tenantId: string = DEFAULT_TENANT_ID,
  ): Promise<Notification> {
    return await this.createNotification(
      {
        user_id: userId,
        type: "medication_reminder",
        title: "Medication Reminder",
        message: `Time to take ${medicationData.name} - ${medicationData.dosage}`,
        action_url: `/portal/medications/${medicationData.id}`,
        metadata: medicationData,
        tenant_id: tenantId,
      },
      tenantId,
    )
  },

  async createTaskNotification(
    userId: string,
    taskData: any,
    tenantId: string = DEFAULT_TENANT_ID,
  ): Promise<Notification> {
    return await this.createNotification(
      {
        user_id: userId,
        type: "task_assigned",
        title: "New Task Assigned",
        message: `You have been assigned a new task: ${taskData.title}`,
        action_url: `/tasks/${taskData.id}`,
        metadata: taskData,
        tenant_id: tenantId,
      },
      tenantId,
    )
  },
}
