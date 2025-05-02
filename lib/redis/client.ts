import { Redis } from "@upstash/redis"

// Initialize Redis client
const getRedisClient = () => {
  // Check if we're using the KV_URL environment variable (Vercel KV)
  if (process.env.KV_URL) {
    return new Redis({
      url: process.env.KV_URL,
      token: process.env.KV_REST_API_TOKEN || "",
    })
  }

  // Fallback to REDIS_URL if available
  if (process.env.REDIS_URL) {
    return new Redis({
      url: process.env.REDIS_URL,
      token: process.env.REDIS_TOKEN || "",
    })
  }

  // Default configuration
  return new Redis({
    url: "https://eu2-careful-mole-30498.upstash.io",
    token: process.env.REDIS_TOKEN || "",
  })
}

// Create Redis client instance
export const redis = getRedisClient()

// Safe Redis operation wrapper
export async function safeRedisOperation<T>(
  operation: () => Promise<T>,
  fallback: T,
  errorMessage = "Redis operation failed",
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    console.error(`${errorMessage}:`, error)
    return fallback
  }
}

// Helper function to generate cache keys
export function generateCacheKey(prefix: string, identifier: string): string {
  return `${prefix}:${identifier}`
}

// Helper function to set cache with expiration
export async function setCacheWithExpiry<T>(key: string, data: T, expirySeconds = 3600): Promise<void> {
  await safeRedisOperation(
    () => redis.set(key, JSON.stringify(data), { ex: expirySeconds }),
    undefined,
    `Failed to set cache for key: ${key}`,
  )
}

// Helper function to get cache data
export async function getCacheData<T>(key: string): Promise<T | null> {
  return safeRedisOperation(
    async () => {
      const data = await redis.get(key)
      return data ? (JSON.parse(data as string) as T) : null
    },
    null,
    `Failed to get cache for key: ${key}`,
  )
}

// Helper function to delete cache
export async function deleteCache(key: string): Promise<void> {
  await safeRedisOperation(() => redis.del(key), undefined, `Failed to delete cache for key: ${key}`)
}
