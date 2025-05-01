import { redis } from "./client"

const ONLINE_USERS_KEY = "online-users"
const USER_PRESENCE_PREFIX = "presence:"
const PRESENCE_TTL = 60 // 60 seconds

interface PresenceInfo {
  userId: string
  username: string
  lastSeen: number
  status: "online" | "away" | "busy" | "offline"
  location?: string
}

/**
 * Update user presence
 */
export async function updatePresence(
  userId: string,
  username: string,
  status: "online" | "away" | "busy" = "online",
  location?: string,
): Promise<void> {
  const presenceKey = `${USER_PRESENCE_PREFIX}${userId}`

  const presenceInfo: PresenceInfo = {
    userId,
    username,
    lastSeen: Date.now(),
    status,
    location,
  }

  // Store presence info with TTL
  await redis.set(presenceKey, JSON.stringify(presenceInfo), { ex: PRESENCE_TTL })

  // Add to online users set
  await redis.zadd(ONLINE_USERS_KEY, { score: Date.now(), member: userId })
}

/**
 * Get user presence
 */
export async function getUserPresence(userId: string): Promise<PresenceInfo | null> {
  const presenceKey = `${USER_PRESENCE_PREFIX}${userId}`

  const presenceStr = await redis.get(presenceKey)
  if (!presenceStr) {
    return null
  }

  return JSON.parse(presenceStr as string) as PresenceInfo
}

/**
 * Get online users
 */
export async function getOnlineUsers(maxAge: number = 5 * 60 * 1000): Promise<PresenceInfo[]> {
  const cutoff = Date.now() - maxAge

  // Remove stale entries
  await redis.zremrangebyscore(ONLINE_USERS_KEY, 0, cutoff)

  // Get remaining user IDs
  const userIds = await redis.zrange(ONLINE_USERS_KEY, 0, -1)

  if (!userIds || userIds.length === 0) {
    return []
  }

  // Get presence info for each user
  const presenceKeys = userIds.map((id) => `${USER_PRESENCE_PREFIX}${id}`)
  const presenceData = await redis.mget(...presenceKeys)

  // Parse and return
  return presenceData.filter(Boolean).map((data) => JSON.parse(data as string) as PresenceInfo)
}
