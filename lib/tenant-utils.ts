import type { NextRequest } from "next/server"
import { executeQuery } from "@/lib/db"
import { cache } from "react"

export type Tenant = {
  id: string
  name: string
  domain: string
  settings: Record<string, any>
  features: string[]
  status: "active" | "inactive" | "suspended"
  created_at: string
  updated_at: string
}

// Cache tenant data for 5 minutes to reduce database queries
const TENANT_CACHE_TIME = 5 * 60 * 1000 // 5 minutes
const tenantCache = new Map<string, { tenant: Tenant; timestamp: number }>()

// Get tenant by ID with caching
export const getTenantById = cache(async (tenantId: string): Promise<Tenant | null> => {
  // Check cache first
  const cached = tenantCache.get(tenantId)
  if (cached && Date.now() - cached.timestamp < TENANT_CACHE_TIME) {
    return cached.tenant
  }

  try {
    const tenants = await executeQuery<Tenant>(`SELECT * FROM tenants WHERE id = $1 AND status = 'active'`, [tenantId])

    if (tenants.length === 0) {
      return null
    }

    // Cache the result
    tenantCache.set(tenantId, { tenant: tenants[0], timestamp: Date.now() })

    return tenants[0]
  } catch (error) {
    console.error("Error fetching tenant:", error)
    return null
  }
})

// Get tenant by domain with caching
export const getTenantByDomain = cache(async (domain: string): Promise<Tenant | null> => {
  // Check cache first
  const cached = Array.from(tenantCache.values()).find((entry) => entry.tenant.domain === domain)
  if (cached && Date.now() - cached.timestamp < TENANT_CACHE_TIME) {
    return cached.tenant
  }

  try {
    const tenants = await executeQuery<Tenant>(`SELECT * FROM tenants WHERE domain = $1 AND status = 'active'`, [
      domain,
    ])

    if (tenants.length === 0) {
      return null
    }

    // Cache the result
    tenantCache.set(tenants[0].id, { tenant: tenants[0], timestamp: Date.now() })

    return tenants[0]
  } catch (error) {
    console.error("Error fetching tenant by domain:", error)
    return null
  }
})

// Extract tenant information from request
export async function getTenantFromRequest(request: NextRequest): Promise<Tenant | null> {
  // Check for tenant ID in header (set by previous middleware)
  const tenantId = request.headers.get("x-tenant-id")
  if (tenantId) {
    return getTenantById(tenantId)
  }

  // Check for tenant in subdomain
  const host = request.headers.get("host") || ""
  const subdomain = host.split(".")[0]

  if (subdomain && subdomain !== "www" && subdomain !== "localhost:3000") {
    // Look up tenant by subdomain
    const tenant = await getTenantByDomain(subdomain)
    if (tenant) {
      return tenant
    }
  }

  // Check for tenant in cookie
  const tenantCookie = request.cookies.get("tenant_id")
  if (tenantCookie) {
    return getTenantById(tenantCookie.value)
  }

  // Default tenant for development (remove in production)
  if (process.env.NODE_ENV === "development") {
    return getTenantById("ba367cfe-6de0-4180-9566-1002b75cf82c") // Default tenant ID
  }

  return null
}

// Clear tenant cache
export function clearTenantCache(tenantId?: string) {
  if (tenantId) {
    tenantCache.delete(tenantId)
  } else {
    tenantCache.clear()
  }
}

// Get tenant ID safely without relying on cookies directly
export async function getTenantId(): Promise<string | null> {
  try {
    // For server components, try to get from environment or default
    if (process.env.DEFAULT_TENANT_ID) {
      return process.env.DEFAULT_TENANT_ID
    }

    // Default for development
    if (process.env.NODE_ENV === "development") {
      return "ba367cfe-6de0-4180-9566-1002b75cf82c" // Default tenant ID
    }

    return null
  } catch (error) {
    console.error("Error getting tenant ID:", error)
    return null
  }
}

