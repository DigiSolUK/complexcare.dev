// lib/tenant-utils.ts

const DEFAULT_TENANT_ID = "default"

// Safely extract tenant ID from tenant object or string
export function extractTenantId(tenant: any): string {
  if (!tenant) return DEFAULT_TENANT_ID

  if (typeof tenant === "string") return tenant

  if (typeof tenant === "object" && tenant !== null && "id" in tenant) {
    return tenant.id
  }

  return DEFAULT_TENANT_ID
}
