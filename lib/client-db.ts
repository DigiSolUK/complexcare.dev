import { DEFAULT_TENANT_ID } from "./constants"

// Client-side database utility
export async function clientDb<T = any>(operation: string, params: any): Promise<T[]> {
  try {
    const response = await fetch("/api/db-proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        operation,
        ...params,
      }),
    })

    if (!response.ok) {
      throw new Error(`Database operation failed: ${response.statusText}`)
    }

    const result = await response.json()
    return result.data || []
  } catch (error) {
    console.error("Client database error:", error)
    return []
  }
}

// Helper functions for common operations
export async function getById<T = any>(
  table: string,
  id: string,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<T | null> {
  const results = await clientDb<T>("getById", { table, id, tenantId })
  return results[0] || null
}

export async function query<T = any>(queryString: string, params: any[] = []): Promise<T[]> {
  return clientDb<T>("query", { query: queryString, params })
}

export async function insert<T = any>(
  table: string,
  data: any,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<T | null> {
  const results = await clientDb<T>("insert", { table, data: { ...data, tenant_id: tenantId }, tenantId })
  return results[0] || null
}

export async function update<T = any>(
  table: string,
  id: string,
  data: any,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<T | null> {
  const results = await clientDb<T>("update", { table, id, data, tenantId })
  return results[0] || null
}

export async function remove(table: string, id: string, tenantId: string = DEFAULT_TENANT_ID): Promise<boolean> {
  await clientDb("delete", { table, id, tenantId })
  return true
}
