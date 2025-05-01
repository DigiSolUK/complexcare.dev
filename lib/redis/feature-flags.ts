import { redis } from "./client"
import { DEFAULT_TENANT_ID } from "../tenant"

const FEATURE_FLAG_PREFIX = "feature:"
const GLOBAL_FEATURE_PREFIX = "global-feature:"

/**
 * Check if a feature is enabled for a tenant
 */
export async function isFeatureEnabled(featureName: string, tenantId: string = DEFAULT_TENANT_ID): Promise<boolean> {
  // First check tenant-specific override
  const tenantKey = `${FEATURE_FLAG_PREFIX}${tenantId}:${featureName}`
  const tenantFeature = await redis.get(tenantKey)

  if (tenantFeature !== null) {
    return tenantFeature === "1"
  }

  // Fall back to global setting
  const globalKey = `${GLOBAL_FEATURE_PREFIX}${featureName}`
  const globalFeature = await redis.get(globalKey)

  return globalFeature === "1"
}

/**
 * Enable a feature for a tenant
 */
export async function enableFeature(featureName: string, tenantId: string = DEFAULT_TENANT_ID): Promise<void> {
  const key = `${FEATURE_FLAG_PREFIX}${tenantId}:${featureName}`
  await redis.set(key, "1")
}

/**
 * Disable a feature for a tenant
 */
export async function disableFeature(featureName: string, tenantId: string = DEFAULT_TENANT_ID): Promise<void> {
  const key = `${FEATURE_FLAG_PREFIX}${tenantId}:${featureName}`
  await redis.set(key, "0")
}

/**
 * Set global feature flag
 */
export async function setGlobalFeature(featureName: string, enabled: boolean): Promise<void> {
  const key = `${GLOBAL_FEATURE_PREFIX}${featureName}`
  await redis.set(key, enabled ? "1" : "0")
}

/**
 * Get all feature flags for a tenant
 */
export async function getTenantFeatures(tenantId: string = DEFAULT_TENANT_ID): Promise<Record<string, boolean>> {
  const pattern = `${FEATURE_FLAG_PREFIX}${tenantId}:*`
  const keys = await redis.keys(pattern)

  if (keys.length === 0) {
    return {}
  }

  const values = await redis.mget(...keys)

  return keys.reduce(
    (acc, key, index) => {
      const featureName = key.split(":")[2]
      acc[featureName] = values[index] === "1"
      return acc
    },
    {} as Record<string, boolean>,
  )
}
