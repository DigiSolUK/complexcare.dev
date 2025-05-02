import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import redis from "@/lib/redis/client"

// Default tenant ID for demo mode
export const DEFAULT_TENANT_ID = "ba367cfe-6de0-4180-9566-1002b75cf82c"

interface Tenant {
  id: string
  name: string
  domain: string
  status: string
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

export async function getTenantIdFromCookies(): Promise<string | null> {
  const cookieStore = cookies()
  return cookieStore.get("tenantId")?.value || null
}

export async function getDefaultTenantId(): Promise<string> {
  return DEFAULT_TENANT_ID
}

export async function ensureTenantId(tenantId: string | null): Promise<string> {
  return tenantId || DEFAULT_TENANT_ID
}

export async function getCurrentTenantId(request?: Request): Promise<string> {
  // If request is provided, try to get from headers
  if (request) {
    const tenantId = request.headers.get("x-tenant-id")
    if (tenantId) return tenantId
  }

  // Otherwise try to get from cookie
  const cookieTenantId = await getTenantIdFromCookies()
  return cookieTenantId || DEFAULT_TENANT_ID
}

export async function getTenantById(id: string): Promise<Tenant | null> {
  // Try to get from Redis cache first
  const cacheKey = `tenant:${id}`
  const cachedTenant = await redis.get(cacheKey)

  if (cachedTenant) {
    try {
      return JSON.parse(cachedTenant as string) as Tenant
    } catch {
      // If parsing fails, continue to fetch from DB
    }
  }

  try {
    const [tenant] = await sql`
      SELECT * FROM tenants
      WHERE id = ${id}
    `

    if (tenant) {
      // Cache for 5 minutes
      await redis.set(cacheKey, JSON.stringify(tenant), { ex: 300 })
    }

    return tenant || null
  } catch (error) {
    console.error("Error fetching tenant:", error)
    return null
  }
}

export async function getCurrentTenant(request?: Request): Promise<Tenant | null> {
  const tenantId = await getCurrentTenantId(request)
  return await getTenantById(tenantId)
}

export function isSuperAdmin(user: { role?: string }): boolean {
  return user?.role === "super_admin"
}

export async function getTenantSettings(tenantId: string): Promise<Record<string, any> | null> {
  try {
    const tenant = await getTenantById(tenantId)
    return tenant?.settings || null
  } catch (error) {
    console.error("Error fetching tenant settings:", error)
    return null
  }
}

export async function updateTenantSettings(tenantId: string, settings: Record<string, any>): Promise<boolean> {
  try {
    // Get current tenant
    const tenant = await getTenantById(tenantId)
    if (!tenant) return false

    // Merge with existing settings
    const updatedSettings = {
      ...tenant.settings,
      ...settings,
    }

    // Update in database
    await sql`
      UPDATE tenants
      SET 
        settings = ${JSON.stringify(updatedSettings)},
        updated_at = NOW()
      WHERE id = ${tenantId}
    `

    // Update cache
    const cacheKey = `tenant:${tenantId}`
    await redis.del(cacheKey)

    return true
  } catch (error) {
    console.error("Error updating tenant settings:", error)
    return false
  }
}
