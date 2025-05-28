import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

/**
 * Get tenant ID from request headers or query params
 */
export function getTenantIdFromRequest(request: NextRequest): string | null {
  // Check headers first
  const tenantHeader = request.headers.get("x-tenant-id")
  if (tenantHeader) return tenantHeader

  // Check query params
  const { searchParams } = new URL(request.url)
  const tenantParam = searchParams.get("tenantId")
  if (tenantParam) return tenantParam

  // Check for tenant in path
  const pathname = request.nextUrl.pathname
  const tenantMatch = pathname.match(/\/tenant\/([^/]+)/)
  if (tenantMatch) return tenantMatch[1]

  return null
}

/**
 * Get tenant from request (server-side)
 */
export async function getTenantFromRequest(request: NextRequest) {
  const tenantId = getTenantIdFromRequest(request)
  if (!tenantId) return null

  try {
    // In a real app, fetch tenant from database
    // For now, return mock data
    return {
      id: tenantId,
      name: "Mock Tenant",
      slug: "mock-tenant",
      plan: "Professional",
    }
  } catch (error) {
    console.error("Error fetching tenant:", error)
    return null
  }
}

/**
 * Get current tenant (server-side)
 */
export async function getCurrentTenant() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return null

    // In a real app, fetch user's primary tenant from database
    // For now, return mock data
    return {
      id: "default-tenant",
      name: "Default Tenant",
      slug: "default-tenant",
      plan: "Professional",
    }
  } catch (error) {
    console.error("Error getting current tenant:", error)
    return null
  }
}

/**
 * Checks if a given tenant ID is valid
 */
export const isValidTenantId = (tenantId: string): boolean => {
  return typeof tenantId === "string" && tenantId.length > 0
}

/**
 * Get tenant configuration
 */
export const getTenantConfig = async (tenantId: string): Promise<any> => {
  // In a real app, fetch from database
  return {
    tenantId: tenantId,
    theme: "default",
    features: ["patients", "appointments", "clinical-notes"],
    settings: {
      allowPublicRegistration: false,
      requireEmailVerification: true,
    },
  }
}
