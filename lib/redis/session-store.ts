import { redis } from "./client"

const SESSION_PREFIX = "session:"
const SESSION_TTL = 24 * 60 * 60 // 24 hours in seconds

/**
 * Store user session data
 */
export async function storeSession(sessionId: string, userData: any) {
  const cacheKey = `${SESSION_PREFIX}${sessionId}`
  await redis.set(cacheKey, JSON.stringify(userData), { ex: SESSION_TTL })
}

/**
 * Get user session data
 */
export async function getSession(sessionId: string) {
  const cacheKey = `${SESSION_PREFIX}${sessionId}`
  const session = await redis.get(cacheKey)

  if (!session) return null

  return JSON.parse(session as string)
}

/**
 * Extend session TTL
 */
export async function extendSession(sessionId: string) {
  const cacheKey = `${SESSION_PREFIX}${sessionId}`
  const session = await redis.get(cacheKey)

  if (session) {
    await redis.expire(cacheKey, SESSION_TTL)
    return true
  }

  return false
}

/**
 * Delete user session
 */
export async function deleteSession(sessionId: string) {
  const cacheKey = `${SESSION_PREFIX}${sessionId}`
  await redis.del(cacheKey)
}
