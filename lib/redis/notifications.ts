import { redis } from "./client"
import { DEFAULT_TENANT_ID } from "../tenant"

const NOTIFICATION_PREFIX = "notification:"
const USER_NOTIFICATIONS_PREFIX = "user-notifications:"

interface Notification {
  id: string
  userId: string
  tenantId: string
  type: string
  title: string
  message: string
  link?: string
  isRead: boolean
  createdAt: number
}

/**
 * Create a notification for a user
 */
export async function createNotification(
  userId: string,
  tenantId: string = DEFAULT_TENANT_ID,
  type: string,
  title: string,
  message: string,
  link?: string,
): Promise<string> {
  const notificationId = crypto.randomUUID()

  const notification: Notification = {
    id: notificationId,
    userId,
    tenantId,
    type,
    title,
    message,
    link,
    isRead: false,
    createdAt: Date.now(),
  }

  // Store notification
  const notificationKey = `${NOTIFICATION_PREFIX}${notificationId}`
  await redis.set(notificationKey, JSON.stringify(notification))

  // Add to user's notifications list
  const userNotificationsKey = `${USER_NOTIFICATIONS_PREFIX}${userId}`
  await redis.zadd(userNotificationsKey, { score: Date.now(), member: notificationId })

  return notificationId
}

/**
 * Get user notifications
 */
export async function getUserNotifications(
  userId: string,
  limit = 20,
  offset = 0,
  includeRead = false,
): Promise<Notification[]> {
  const userNotificationsKey = `${USER_NOTIFICATIONS_PREFIX}${userId}`

  // Get notification IDs from sorted set (newest first)
  const notificationIds = await redis.zrange(userNotificationsKey, offset, offset + limit - 1, { rev: true })

  if (!notificationIds || notificationIds.length === 0) {
    return []
  }

  // Get notifications
  const notificationKeys = notificationIds.map((id) => `${NOTIFICATION_PREFIX}${id}`)
  const notifications = await redis.mget(...notificationKeys)

  // Parse and filter
  return notifications
    .filter(Boolean)
    .map((n) => JSON.parse(n as string) as Notification)
    .filter((n) => includeRead || !n.isRead)
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  const notificationKey = `${NOTIFICATION_PREFIX}${notificationId}`

  const notificationStr = await redis.get(notificationKey)
  if (!notificationStr) {
    return false
  }

  const notification = JSON.parse(notificationStr as string) as Notification
  notification.isRead = true

  await redis.set(notificationKey, JSON.stringify(notification))

  return true
}

/**
 * Mark all user notifications as read
 */
export async function markAllNotificationsAsRead(userId: string): Promise<number> {
  const userNotificationsKey = `${USER_NOTIFICATIONS_PREFIX}${userId}`

  // Get all notification IDs
  const notificationIds = await redis.zrange(userNotificationsKey, 0, -1)

  if (!notificationIds || notificationIds.length === 0) {
    return 0
  }

  let count = 0

  // Update each notification
  for (const id of notificationIds) {
    const notificationKey = `${NOTIFICATION_PREFIX}${id}`
    const notificationStr = await redis.get(notificationKey)

    if (notificationStr) {
      const notification = JSON.parse(notificationStr as string) as Notification

      if (!notification.isRead) {
        notification.isRead = true
        await redis.set(notificationKey, JSON.stringify(notification))
        count++
      }
    }
  }

  return count
}
