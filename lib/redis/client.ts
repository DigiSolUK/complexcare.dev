import { createClient } from "@upstash/redis"

// Create Redis client
export const redis = createClient({
  url: process.env.REDIS_URL || process.env.KV_URL || "",
  token: process.env.REDIS_TOKEN || process.env.KV_REST_API_TOKEN || "",
})

/**
 * Safely execute a Redis operation with error handling
 * @param operation Function that performs a Redis operation
 * @param fallback Fallback value to return if the operation fails
 * @returns Result of the operation or fallback value
 */
export async function safeRedisOperation<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    console.error("Redis operation failed:", error)
    return fallback
  }
}

/**
 * Test the Redis connection
 * @returns A boolean indicating if the connection was successful
 */
export async function testRedisConnection(): Promise<boolean> {
  return await safeRedisOperation(async () => {
    const pong = await redis.ping()
    return pong === "PONG"
  }, false)
}

// Export the Redis client
export default redis
