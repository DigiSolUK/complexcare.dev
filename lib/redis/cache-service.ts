import { Redis } from "@upstash/redis"

// Create Redis client
const redis = new Redis({
  url: process.env.KV_REST_API_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
})

class CacheService {
  /**
   * Get a value from cache
   * @param key - Cache key
   * @returns The cached value or null if not found
   */
  async get(key: string): Promise<string | null> {
    try {
      return await redis.get(key)
    } catch (error) {
      console.error("Redis get error:", error)
      return null
    }
  }

  /**
   * Set a value in cache
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Time to live in seconds (optional)
   * @returns Success status
   */
  async set(key: string, value: string, ttl?: number): Promise<boolean> {
    try {
      if (ttl) {
        await redis.set(key, value, { ex: ttl })
      } else {
        await redis.set(key, value)
      }
      return true
    } catch (error) {
      console.error("Redis set error:", error)
      return false
    }
  }

  /**
   * Delete a value from cache
   * @param key - Cache key
   * @returns Success status
   */
  async del(key: string): Promise<boolean> {
    try {
      await redis.del(key)
      return true
    } catch (error) {
      console.error("Redis del error:", error)
      return false
    }
  }

  /**
   * Check if a key exists in cache
   * @param key - Cache key
   * @returns True if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      return (await redis.exists(key)) === 1
    } catch (error) {
      console.error("Redis exists error:", error)
      return false
    }
  }

  /**
   * Increment a counter in cache
   * @param key - Cache key
   * @param increment - Amount to increment (default: 1)
   * @returns New value
   */
  async incr(key: string, increment = 1): Promise<number> {
    try {
      if (increment === 1) {
        return await redis.incr(key)
      } else {
        return await redis.incrby(key, increment)
      }
    } catch (error) {
      console.error("Redis incr error:", error)
      return 0
    }
  }

  /**
   * Set key expiration
   * @param key - Cache key
   * @param ttl - Time to live in seconds
   * @returns Success status
   */
  async expire(key: string, ttl: number): Promise<boolean> {
    try {
      return (await redis.expire(key, ttl)) === 1
    } catch (error) {
      console.error("Redis expire error:", error)
      return false
    }
  }

  /**
   * Get multiple values from cache
   * @param keys - Array of cache keys
   * @returns Array of values
   */
  async mget(keys: string[]): Promise<(string | null)[]> {
    try {
      return await redis.mget(...keys)
    } catch (error) {
      console.error("Redis mget error:", error)
      return keys.map(() => null)
    }
  }

  /**
   * Set multiple values in cache
   * @param entries - Array of [key, value] pairs
   * @returns Success status
   */
  async mset(entries: [string, string][]): Promise<boolean> {
    try {
      const args: string[] = entries.flat()
      await redis.mset(...args)
      return true
    } catch (error) {
      console.error("Redis mset error:", error)
      return false
    }
  }
}

// Export singleton instance
export const cache = new CacheService()
