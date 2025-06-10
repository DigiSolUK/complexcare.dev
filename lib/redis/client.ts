import { Redis } from "@upstash/redis"

// Initialize Redis client
const getRedisClient = (): Redis => {
  try {
    const kvUrl = process.env.KV_URL
    const kvRestApiToken = process.env.KV_REST_API_TOKEN
    const kvRestApiUrl = process.env.KV_REST_API_URL // For direct REST API usage

    // Preferred: Vercel KV (uses KV_URL and KV_REST_API_TOKEN)
    if (kvUrl && kvRestApiToken) {
      return new Redis({
        url: kvUrl,
        token: kvRestApiToken,
      })
    }

    // Alternative: Upstash Redis REST API (if KV_URL is not set but KV_REST_API_URL is)
    if (kvRestApiUrl && kvRestApiToken) {
      return new Redis({
        url: kvRestApiUrl,
        token: kvRestApiToken,
      })
    }

    console.warn(
      "Redis environment variables (KV_URL/KV_REST_API_URL and KV_REST_API_TOKEN) not found. Using in-memory Redis mock. This is not suitable for production.",
    )
    return createMockRedisClient()
  } catch (error) {
    console.error("Failed to initialize Redis client:", error)
    console.warn("Falling back to in-memory Redis mock due to initialization error.")
    return createMockRedisClient()
  }
}

// Create a mock Redis client for development/fallback
// This ensures the application can run locally without full Redis setup,
// but with a warning that it's not for production.
function createMockRedisClient(): Redis {
  const store = new Map<string, string>()
  const expirations = new Map<string, NodeJS.Timeout>()

  const setExpiration = (key: string, ttlSeconds: number) => {
    if (expirations.has(key)) {
      clearTimeout(expirations.get(key)!)
    }
    const timeoutId = setTimeout(() => {
      store.delete(key)
      expirations.delete(key)
    }, ttlSeconds * 1000)
    expirations.set(key, timeoutId)
  }

  return {
    get: async (key: string) => {
      return store.get(key) || null
    },
    set: async (key: string, value: any, options?: { ex?: number; px?: number; nx?: boolean; xx?: boolean }) => {
      if (options?.nx && store.has(key)) return null // NX: Set only if key does not exist
      if (options?.xx && !store.has(key)) return null // XX: Set only if key exists

      store.set(key, typeof value === "string" ? value : JSON.stringify(value))
      if (options?.ex) {
        // EX: seconds
        setExpiration(key, options.ex)
      } else if (options?.px) {
        // PX: milliseconds
        setExpiration(key, options.px / 1000)
      }
      return "OK"
    },
    del: async (...keys: string[]) => {
      let count = 0
      for (const key of keys) {
        if (store.delete(key)) {
          if (expirations.has(key)) {
            clearTimeout(expirations.get(key)!)
            expirations.delete(key)
          }
          count++
        }
      }
      return count
    },
    incr: async (key: string) => {
      const value = store.get(key)
      const num = value ? Number.parseInt(value, 10) : 0
      if (isNaN(num)) throw new Error("Value is not an integer or out of range")
      const newValue = num + 1
      store.set(key, newValue.toString())
      return newValue
    },
    exists: async (...keys: string[]) => {
      let count = 0
      for (const key of keys) {
        if (store.has(key)) {
          count++
        }
      }
      return count
    },
    expire: async (key: string, seconds: number) => {
      if (!store.has(key)) return 0
      setExpiration(key, seconds)
      return 1
    },
    ping: async () => "PONG",
    // Add other methods used by your application as mock implementations
    // For example, if you use zadd, mget, etc.
    zadd: async (key: string, ...args: any[]) => {
      console.warn(`MockRedis: zadd(${key}, ${args.join(", ")}) not fully implemented.`)
      return 0 // Placeholder
    },
    zpopmin: async (key: string, count: number) => {
      console.warn(`MockRedis: zpopmin(${key}, ${count}) not fully implemented.`)
      return [] // Placeholder
    },
    zrange: async (key: string, start: number, stop: number, options?: any) => {
      console.warn(`MockRedis: zrange(${key}, ${start}, ${stop}) not fully implemented.`)
      return [] // Placeholder
    },
    zrem: async (key: string, ...members: string[]) => {
      console.warn(`MockRedis: zrem(${key}, ${members.join(", ")}) not fully implemented.`)
      return 0 // Placeholder
    },
    zremrangebyscore: async (key: string, min: string | number, max: string | number) => {
      console.warn(`MockRedis: zremrangebyscore(${key}, ${min}, ${max}) not fully implemented.`)
      return 0 // Placeholder
    },
    sadd: async (key: string, ...members: string[]) => {
      console.warn(`MockRedis: sadd(${key}, ${members.join(", ")}) not fully implemented.`)
      return 0 // Placeholder
    },
    mget: async (...keys: string[]) => {
      console.warn(`MockRedis: mget(${keys.join(", ")}) not fully implemented.`)
      return keys.map(() => null) // Placeholder
    },
    keys: async (pattern: string) => {
      console.warn(`MockRedis: keys(${pattern}) not fully implemented.`)
      // Basic pattern matching for mock
      if (pattern === "*") return Array.from(store.keys())
      const regex = new RegExp(`^${pattern.replace(/\*/g, ".*")}$`)
      return Array.from(store.keys()).filter((k) => regex.test(k))
    },
    // Ensure all methods expected by Redis type are present or add `as unknown as Redis`
  } as unknown as Redis // Cast to Redis type, ensure mock implements all used methods
}

// Create Redis client instance
export const redis: Redis = getRedisClient()

// Test Redis connection
export async function testRedisConnection(): Promise<boolean> {
  try {
    const pong = await redis.ping()
    return pong === "PONG"
  } catch (error) {
    // Don't log verbose error if it's the mock client, it's expected to work.
    if (!(redis as any)._isMock) {
      // Add a flag to mock if needed, or check constructor name
      console.error("Redis connection test failed:", error)
    }
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
    undefined, // Fallback value for void function
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
  await safeRedisOperation(
    async () => {
      await redis.del(key)
    },
    undefined, // Fallback value for void function
    `Failed to delete cache for key: ${key}`,
  )
}

// Export the Redis client as default
export default redis
