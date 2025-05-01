import { tenantIdSchema } from "./validations/schemas"

// Define the default tenant ID
export const DEFAULT_TENANT_ID = "ba367cfe-6de0-4180-9566-1002b75cf82c"

// Define a schema for validating tenant IDs

// Default tenant ID for the entire application

/**
 * Legacy function for backward compatibility
 * @returns The default tenant ID
 */
export function getDefaultTenantId(): string {
  return DEFAULT_TENANT_ID
}

/**
 * Gets the current tenant ID, with fallback to default
 * @param requestedTenantId Optional tenant ID to validate
 * @returns Valid tenant ID
 */
export function getCurrentTenantId(requestedTenantId?: string): string {
  try {
    // If a tenant ID is provided, validate it
    if (requestedTenantId) {
      return tenantIdSchema.parse(requestedTenantId)
    }

    // Otherwise use the default
    return DEFAULT_TENANT_ID
  } catch (error) {
    // If validation fails, return the default
    console.warn("Invalid tenant ID provided, using default", error)
    return DEFAULT_TENANT_ID
  }
}

/**
 * Ensures all data has the correct tenant ID
 * @param data Object or array of objects to ensure tenant ID on
 * @param tenantId Optional tenant ID to use (defaults to DEFAULT_TENANT_ID)
 * @returns Data with tenant ID enforced
 */
export function ensureTenantId<T extends { tenantId?: string }>(
  data: T | T[],
  tenantId: string = DEFAULT_TENANT_ID,
): T | T[] {
  const validTenantId = getCurrentTenantId(tenantId)

  if (Array.isArray(data)) {
    return data.map((item) => ({
      ...item,
      tenantId: validTenantId,
    }))
  }

  return {
    ...data,
    tenantId: validTenantId,
  }
}

/**
 * Creates a tenant-scoped query object for database queries
 * @param query Existing query object
 * @param tenantId Optional tenant ID to use (defaults to DEFAULT_TENANT_ID)
 * @returns Query with tenant ID added
 */
export function withTenant<T extends Record<string, any>>(
  query: T = {} as T,
  tenantId: string = DEFAULT_TENANT_ID,
): T & { tenantId: string } {
  return {
    ...query,
    tenantId: getCurrentTenantId(tenantId),
  }
}
