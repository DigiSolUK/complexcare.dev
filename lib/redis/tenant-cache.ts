import { redis } from "./client"
import { DEFAULT_TENANT_ID } from "../tenant"

const TENANT_CACHE_PREFIX = "tenant:"
const TENANT_FEATURES_PREFIX = "tenant-features:"
const DEFAULT_CACHE_TTL = 60 * 60 // 1 hour in seconds

/**
 * Get tenant data from cache or fetch it if not available
 */
export async function getCachedTenant(tenantId: string = DEFAULT_TENANT_ID, fetchFn: () => Promise<any>) {
  const cacheKey = `${TENANT_CACHE_PREFIX}${tenantId}`

  // Try to get from cache first
  const cachedTenant = await redis.get(cacheKey)
  if (cachedTenant) {
    return JSON.parse(cachedTenant as string)
  }

  // If not in cache, fetch and store
  const tenant = await fetchFn()
  if (tenant) {
    await redis.set(cacheKey, JSON.stringify(tenant), { ex: DEFAULT_CACHE_TTL })
  }

  return tenant
}

/**
 * Store tenant data in cache
 */
export async function cacheTenant(tenantId: string, tenantData: any) {
  const cacheKey = `${TENANT_CACHE_PREFIX}${tenantId}`
  await redis.set(cacheKey, JSON.stringify(tenantData), { ex: DEFAULT_CACHE_TTL })
}

/**
 * Invalidate tenant cache
 */
export async function invalidateTenantCache(tenantId: string) {
  const cacheKey = `${TENANT_CACHE_PREFIX}${tenantId}`
  await redis.del(cacheKey)
}

/**
 * Get tenant features from cache or fetch them if not available
 */
export async function getCachedTenantFeatures(tenantId: string = DEFAULT_TENANT_ID, fetchFn: () => Promise<any>) {
  const cacheKey = `${TENANT_FEATURES_PREFIX}${tenantId}`

  // Try to get from cache first
  const cachedFeatures = await redis.get(cacheKey)
  if (cachedFeatures) {
    return JSON.parse(cachedFeatures as string)
  }

  // If not in cache, fetch and store
  const features = await fetchFn()
  if (features) {
    await redis.set(cacheKey, JSON.stringify(features), { ex: DEFAULT_CACHE_TTL })
  }

  return features
}
