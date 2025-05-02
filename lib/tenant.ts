import { cookies } from "next/headers"
import { cache } from "react"

// Default tenant ID to use when none is specified
export const DEFAULT_TENANT_ID = process.env.DEFAULT_TENANT_ID || "11111111-1111-1111-1111-111111111111"

// Get the current tenant ID from cookies or use default
export const getCurrentTenantId = cache(() => {
  try {
    // Use try-catch because cookies() only works in Server Components
    const cookieStore = cookies()
    return cookieStore.get("tenantId")?.value || DEFAULT_TENANT_ID
  } catch (error) {
    // If cookies() fails (client component), return default
    return DEFAULT_TENANT_ID
  }
})

// Get the default tenant ID
export function getDefaultTenantId(): string {
  return DEFAULT_TENANT_ID
}

// Ensure a valid tenant ID is used
export function ensureTenantId(tenantId?: string | null): string {
  return tenantId || DEFAULT_TENANT_ID
}

// Get current tenant details (placeholder - would fetch from DB in real app)
export async function getCurrentTenant() {
  const tenantId = getCurrentTenantId()

  // In a real app, you would fetch tenant details from the database
  return {
    id: tenantId,
    name: `Tenant ${tenantId.substring(0, 8)}`,
    isActive: true,
    createdAt: new Date().toISOString(),
    settings: {
      theme: "light",
      features: ["patients", "appointments", "billing"],
    },
  }
}

// Client-safe version that doesn't use cookies() API
export function getClientTenantId(): string {
  // In client components, we would get this from localStorage or context
  if (typeof window !== "undefined") {
    return localStorage.getItem("tenantId") || DEFAULT_TENANT_ID
  }
  return DEFAULT_TENANT_ID
}

// Function to set tenant ID in cookies (server-side)
export async function setTenantId(tenantId: string): Promise<void> {
  // This would be implemented in a server action or API route
  // that sets the cookie and returns
}

// Function to validate if a tenant exists
export async function validateTenantExists(tenantId: string): Promise<boolean> {
  // In a real app, this would check the database
  return tenantId.length === 36 // Simple UUID validation
}
