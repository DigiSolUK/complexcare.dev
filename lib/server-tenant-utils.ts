import { cookies } from "next/headers"
import { DEFAULT_UUID, isValidUUID } from "./tenant-utils"

// Server-only function to get tenant ID from cookies
export function getServerTenantId(): string {
  try {
    const cookieStore = cookies()
    return cookieStore.get("tenantId")?.value || "demo-tenant-1"
  } catch (error) {
    console.error("Error accessing cookies in server component:", error)
    return "demo-tenant-1"
  }
}

// Server-only function to get tenant UUID or fallback
export function getServerTenantUUID(): string {
  const tenantId = getServerTenantId()
  return isValidUUID(tenantId) ? tenantId : DEFAULT_UUID
}

