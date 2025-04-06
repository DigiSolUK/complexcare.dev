"use client"

import type { NextRequest } from "next/server"
import { executeQuery } from "@/lib/db"
import { cache } from "react"
import { cookies } from "next/headers" // Already imported
import { unstable_cache } from "next/cache"

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

// Function to check if a string is a valid UUID
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// Default UUID to use as fallback
export const DEFAULT_UUID = "00000000-0000-0000-0000-000000000000"

// Generate a random UUID
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// The following code needs to be updated to work correctly in server components
// due to the usage of next/headers cookies

// Function to get tenant ID from cookies or default to a demo tenant
export const getTenantId = unstable_cache(async (): Promise<string> => {
  try {
    // This will only work in server components
    if (typeof window === "undefined") {
      try {
        return cookies().get("tenantId")?.value || "demo-tenant-1"
      } catch (error) {
        console.error("Error accessing cookies:", error)
        return "demo-tenant-1"
      }
    } else {
      // Client-side fallback
      const cookiesStr = document.cookie
      const cookies = cookiesStr.split(";")
      const tenantCookie = cookies.find((cookie) => cookie.trim().startsWith("tenantId="))
      return tenantCookie ? tenantCookie.split("=")[1] : "demo-tenant-1"
    }
  } catch (error) {
    console.error("Error in getTenantId:", error)
    return "demo-tenant-1"
  }
}, ["tenantId"])

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

