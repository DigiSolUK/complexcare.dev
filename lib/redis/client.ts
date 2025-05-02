import { Redis } from "@upstash/redis"

// Create Redis client using environment variables
export const redis = new Redis({
  url: process.env.KV_REST_API_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
})

// Check if Redis is available
export async function isRedisAvailable(): Promise<boolean> {
  try {
    await redis.ping()
    return true
  } catch (error) {
    console.error("Redis connection failed:", error)
    return false
  }
}

// Safe Redis wrapper that falls back gracefully
export async function safeRedisOperation<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    console.error("Redis operation failed:", error)
    return fallback
  }
}
