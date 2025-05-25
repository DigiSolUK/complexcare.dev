import { Redis } from "@upstash/redis"
import { getRedisUrl, getRedisToken } from "../env-safe"

// Initialize Redis client
const getRedisClient = () => {
  try {
    // Get Redis URL and token from environment variables using the safe accessor
    const redisUrl = getRedisUrl()
    const redisToken = getRedisToken()

    // For Upstash Redis on Vercel, use KV_URL and KV_REST_API_TOKEN
    if (redisUrl && redisToken) {
      return new Redis({
        url: redisUrl,
        token: redisToken,
      })
    }

    // If no valid Redis credentials, use in-memory fallback
    console.warn("Using in-memory Redis mock (no valid Upstash REST API credentials found)")
    return createMockRedisClient()
  } catch (error) {
    console.error("Failed to initialize Redis client:", error)
    return createMockRedisClient()
  }
}

// Create a mock Redis client for development/fallback
function createMockRedisClient() {
  const store = new Map<string, string>()

  return {
    get: async (key: string) => {
      return store.get(key) || null
    },
    set: async (key: string, value: any, options?: { ex?: number }) => {
      store.set(key, JSON.stringify(value))
      return "OK"
    },
    del: async (key: string) => {
      return store.delete(key) ? 1 : 0
    },
    incr: async (key: string) => {
      const value = store.get(key)
      const num = value ? Number.parseInt(value, 10) : 0
      store.set(key, (num + 1).toString())
      return num + 1
    },
    hget: async (key: string, field: string) => {
      const hash = store.get(key)
      if (!hash) return null
      try {
        const parsed = JSON.parse(hash)
        return parsed[field] || null
      } catch {
        return null
      }
    },
    hset: async (key: string, field: string, value: any) => {
      const hash = store.get(key)
      const parsed = hash ? JSON.parse(hash) : {}
      parsed[field] = value
      store.set(key, JSON.stringify(parsed))
      return 1
    },
    hmget: async (key: string, ...fields: string[]) => {
      const hash = store.get(key)
      if (!hash) return fields.map(() => null)
      try {
        const parsed = JSON.parse(hash)
        return fields.map((field) => parsed[field] || null)
      } catch {
        return fields.map(() => null)
      }
    },
    hmset: async (key: string, fieldValues: Record<string, any>) => {
      const hash = store.get(key)
      const parsed = hash ? JSON.parse(hash) : {}
      Object.assign(parsed, fieldValues)
      store.set(key, JSON.stringify(parsed))
      return "OK"
    },
    expire: async (key: string, seconds: number) => {
      if (!store.has(key)) return 0
      setTimeout(() => {
        store.delete(key)
      }, seconds * 1000)
      return 1
    },
    ping: async () => "PONG",
  } as unknown as Redis
}

// Create Redis client instance
export const redis = getRedisClient()

// Test Redis connection
export async function testRedisConnection(): Promise<boolean> {
  try {
    const pong = await redis.ping()
    return pong === "PONG"
  } catch (error) {
    console.error("Redis connection test failed:", error)
    return false
  }
}

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

// Export the Redis client as default
export default redis
