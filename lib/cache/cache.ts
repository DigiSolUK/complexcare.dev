// Simple in-memory cache utility

type CacheEntry<T> = {
  value: T
  expiry: number | null
}

// Cache storage
const cache = new Map<string, CacheEntry<any>>()

// Set cache entry
export function setCacheEntry<T>(
  key: string,
  value: T,
  ttlSeconds: number | null = 300, // Default TTL: 5 minutes
): void {
  const expiry = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null

  cache.set(key, {
    value,
    expiry,
  })
}

// Get cache entry
export function getCacheEntry<T>(key: string): T | null {
  const entry = cache.get(key)

  if (!entry) {
    return null
  }

  // Check if entry has expired
  if (entry.expiry && Date.now() > entry.expiry) {
    cache.delete(key)
    return null
  }

  return entry.value as T
}

// Delete cache entry
export function deleteCacheEntry(key: string): void {
  cache.delete(key)
}

// Clear all cache entries
export function clearCache(): void {
  cache.clear()
}

// Get cache stats
export function getCacheStats(): {
  size: number
  keys: string[]
} {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  }
}

// Cached function execution
export async function cachedExecution<T>(
  key: string,
  fn: () => Promise<T>,
  ttlSeconds: number | null = 300,
): Promise<T> {
  // Check cache first
  const cachedValue = getCacheEntry<T>(key)

  if (cachedValue !== null) {
    return cachedValue
  }

  // Execute function
  const result = await fn()

  // Cache result
  setCacheEntry(key, result, ttlSeconds)

  return result
}

