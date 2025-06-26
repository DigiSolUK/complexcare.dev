import { sql } from "@/lib/db"
import { getTenantIdFromRequest } from "@/lib/tenant-utils"
import type { NextRequest } from "next/server"

/**
 * Executes a SQL query, automatically filtering by the current tenant ID.
 * This function is intended for server-side use within API routes or server components.
 *
 * @param request The NextRequest object to extract the tenant ID from.
 * @param query The SQL query string.
 * @param params Optional array of parameters for the SQL query.
 * @returns The result of the SQL query.
 * @throws Error if tenant ID cannot be determined or if the query fails.
 */
export async function tenantQuery<T>(request: NextRequest, query: string, params: any[] = []): Promise<T[]> {
  const tenantId = await getTenantIdFromRequest(request)

  if (!tenantId) {
    throw new Error("Tenant ID not found in request.")
  }

  // Ensure the query includes a tenant_id filter
  // This is a basic check; for more complex queries, you might need to
  // ensure the tenant_id is correctly applied in joins, etc.
  const tenantFilteredQuery = `${query} WHERE tenant_id = $${params.length + 1}`
  const allParams = [...params, tenantId]

  try {
    const result = await sql<T[]>(tenantFilteredQuery, allParams)
    return result
  } catch (error) {
    console.error("Database query failed for tenant:", tenantId, error)
    throw new Error("Failed to execute tenant-scoped query.")
  }
}
