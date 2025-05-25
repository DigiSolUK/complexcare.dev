import { redis } from "./client"

export class CacheService {
  /**
   * Get a value from the cache
   * @param key The cache key
   * @returns The cached value or null if not found
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      return (await redis.get(key)) as T | null
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error)
      return null
    }
  }

  /**
   * Set a value in the cache
   * @param key The cache key
   * @param value The value to cache
   * @param ttlSeconds Time to live in seconds (optional)
   * @returns true if successful, false otherwise
   */
  static async set<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean> {
    try {
      if (ttlSeconds) {
        await redis.set(key, value, { ex: ttlSeconds })
      } else {
        await redis.set(key, value)
      }
      return true
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error)
      return false
    }
  }

  /**
   * Delete a value from the cache
   * @param key The cache key
   * @returns true if successful, false otherwise
   */
  static async delete(key: string): Promise<boolean> {
    try {
      await redis.del(key)
      return true
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error)
      return false
    }
  }

  /**
   * Check if a key exists in the cache
   * @param key The cache key
   * @returns true if the key exists, false otherwise
   */
  static async exists(key: string): Promise<boolean> {
    try {
      return (await redis.exists(key)) === 1
    } catch (error) {
      console.error(`Cache exists error for key ${key}:`, error)
      return false
    }
  }

  /**
   * Get a value from the cache or compute it if not found
   * @param key The cache key
   * @param fn The function to compute the value if not found
   * @param ttlSeconds Time to live in seconds (optional)
   * @returns The cached or computed value
   */
  static async getOrSet<T>(key: string, fn: () => Promise<T>, ttlSeconds?: number): Promise<T | null> {
    try {
      const cachedValue = await this.get<T>(key)

      if (cachedValue !== null) {
        return cachedValue
      }

      const computedValue = await fn()
      await this.set(key, computedValue, ttlSeconds)
      return computedValue
    } catch (error) {
      console.error(`Cache getOrSet error for key ${key}:`, error)
      return null
    }
  }
}

// Simple cache interface for backward compatibility
export const cache = {\
  get: <T>(key: string): Promise<T | null> => CacheService.get<T>(key),
  set: <T>(key: string, value: T, ttlSeconds?: number): Promise<boolean> =>
    CacheService.set<T>(key, value, ttlSeconds),
  delete: (key: string): Promise<boolean> => CacheService.delete(key),
  exists: (key: string): Promise<boolean> => CacheService.exists(key),
}
