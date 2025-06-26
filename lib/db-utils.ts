import { neon } from "@neondatabase/serverless"
import { v4 as uuidv4 } from "uuid"

export function isValidUUID(uuid: string) {
  if (!uuid) return false
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid)
}

/**
 * Builds a parameterized SQL UPDATE query string and its corresponding values array.
 * @param table The name of the table to update.
 * @param data An object containing the columns and values to update.
 * @param where An object specifying the WHERE clause conditions (e.g., { id: 'some-uuid', tenant_id: 'another-uuid' }).
 * @returns An object containing the query string and the array of values.
 */
export function buildUpdateQuery(
  table: string,
  data: Record<string, any>,
  where: Record<string, any>,
): { query: string; values: any[] } {
  const dataEntries = Object.entries(data).filter(([, value]) => value !== undefined)
  const whereEntries = Object.entries(where)

  if (dataEntries.length === 0) {
    throw new Error("No fields to update.")
  }

  const values: any[] = []
  let paramIndex = 1

  const setClauses = dataEntries.map(([key, value]) => {
    values.push(value)
    return `${key} = $${paramIndex++}`
  })

  // Always update the updated_at timestamp
  setClauses.push(`updated_at = NOW()`)

  const whereClauses = whereEntries.map(([key, value]) => {
    values.push(value)
    return `${key} = $${paramIndex++}`
  })

  const query = `
    UPDATE ${table}
    SET ${setClauses.join(", ")}
    WHERE ${whereClauses.join(" AND ")}
    RETURNING *;
  `

  return { query, values }
}

// Execute a query for a specific tenant
export async function tenantQuery<T>(tenantId: string, queryText: string, params: any[] = []): Promise<T[]> {
  if (!isValidUUID(tenantId)) {
    console.warn("Invalid tenant ID provided. Skipping query execution.")
    return []
  }
  try {
    // Get the database URL from environment variables
    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl) {
      console.error("DATABASE_URL environment variable is not set.")
      return []
    }

    // Create a SQL client
    const sql = neon(databaseUrl)

    // Log the query for debugging
    console.log(`Executing query for tenant ${tenantId}:`, queryText, params)

    // Execute the query
    const result = await sql.query(queryText, params)
    console.log(`Query result rows: ${result.rows?.length || 0}`)

    return result.rows as T[]
  } catch (error) {
    console.error("Error executing tenant query:", error)
    return []
  }
}

// Insert a record for a specific tenant (simplified for now)
export async function tenantInsert<T>(tenantId: string, table: string, data: any): Promise<T[]> {
  if (!isValidUUID(tenantId)) {
    console.warn("Invalid tenant ID provided. Skipping insert operation.")
    return []
  }
  try {
    // Get the database URL from environment variables
    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl) {
      console.error("DATABASE_URL environment variable is not set.")
      return []
    }

    // Create a SQL client
    const sql = neon(databaseUrl)

    if (!data.id) {
      data.id = uuidv4()
    }
    data.tenant_id = tenantId

    const query = `
      INSERT INTO ${table} (${Object.keys(data).join(", ")})
      VALUES (${Object.values(data)
        .map((v, i) => `$${i + 1}`)
        .join(", ")})
      RETURNING *
    `

    const values = Object.values(data)

    // Log the query for debugging
    console.log(`Executing insert for tenant ${tenantId}:`, query, values)

    // Execute the query
    const result = await sql.query(query, values)
    console.log(`Query result rows: ${result.rows?.length || 0}`)

    return result.rows as T[]
  } catch (error) {
    console.error("Error executing tenant insert:", error)
    return []
  }
}

// Update a record for a specific tenant (simplified for now)
export async function tenantUpdate<T>(tenantId: string, table: string, id: string, data: any): Promise<T[]> {
  if (!isValidUUID(tenantId) || !isValidUUID(id)) {
    console.warn("Invalid tenant or record ID provided. Skipping update operation.")
    return []
  }
  try {
    // Get the database URL from environment variables
    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl) {
      console.error("DATABASE_URL environment variable is not set.")
      return []
    }

    // Create a SQL client
    const sql = neon(databaseUrl)

    const { query, values } = buildUpdateQuery(table, data, { id, tenant_id: tenantId })

    // Log the query for debugging
    console.log(`Executing update for tenant ${tenantId}:`, query, values)

    // Execute the query
    const result = await sql.query(query, values)
    console.log(`Query result rows: ${result.rows?.length || 0}`)

    return result.rows as T[]
  } catch (error) {
    console.error("Error executing tenant update:", error)
    return []
  }
}

// Delete a record for a specific tenant (simplified for now)
export async function tenantDelete<T>(tenantId: string, table: string, id: string): Promise<T[]> {
  return [] as T[]
}

// Helper function to get mock data based on the query
// This function should be removed or disabled in production
function getMockData<T>(query: string): T[] {
  console.warn("FALLING BACK TO MOCK DATA. THIS SHOULD NOT HAPPEN IN PRODUCTION.")
  return [] as T[]
}
