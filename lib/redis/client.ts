import { Redis } from "@upstash/redis"

// Create Redis client using environment variables
export const redis = new Redis({
  url: process.env.REDIS_URL || process.env.KV_URL,
  token: process.env.KV_REST_API_TOKEN,
})

// Test if Redis is connected
export async function testRedisConnection(): Promise<boolean> {
  try {
    await redis.ping()
    return true
  } catch (error) {
    console.error("Redis connection failed:", error)
    return false
  }
}
