import { neon } from "@neondatabase/serverless"

const DEFAULT_TENANT_ID = "default"

// Update the sql initialization to handle missing DATABASE_URL
export const sql = process.env.DATABASE_URL
  ? neon(process.env.DATABASE_URL)
  : {
      // Provide a mock implementation when DATABASE_URL is not available
      query: async () => {
        console.warn("No DATABASE_URL provided, mock SQL client being used")
        return { rows: [] }
      },
    }

// Update the executeQuery function to handle missing DATABASE_URL
export async function executeQuery(
  query: string,
  params: any[] = [],
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<any[]> {
  if (!process.env.DATABASE_URL) {
    console.warn("No DATABASE_URL provided, returning empty result")
    return []
  }

  try {
    const result = await sql.query(query, params)
    return result.rows || []
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}
