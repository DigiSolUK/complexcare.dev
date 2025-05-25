import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db-manager"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

// This API route acts as a proxy for database operations
export async function POST(request: NextRequest) {
  try {
    // Get the operation details from the request
    const { operation, table, id, data, tenantId = DEFAULT_TENANT_ID, query, params } = await request.json()

    // Execute the appropriate database operation
    let result
    switch (operation) {
      case "query":
        result = await sql.query(query, params)
        break
      case "getById":
        result = await sql.query(`SELECT * FROM ${table} WHERE id = $1 AND tenant_id = $2`, [id, tenantId])
        break
      case "insert":
        // Build the insert query
        const columns = Object.keys(data)
        const values = Object.values(data)
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ")
        result = await sql.query(
          `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders}) RETURNING *`,
          values,
        )
        break
      case "update":
        // Build the update query
        const updateFields = Object.keys(data)
          .map((key, i) => `${key} = $${i + 3}`)
          .join(", ")
        result = await sql.query(
          `UPDATE ${table} SET ${updateFields}, updated_at = NOW() WHERE id = $1 AND tenant_id = $2 RETURNING *`,
          [id, tenantId, ...Object.values(data)],
        )
        break
      case "delete":
        result = await sql.query(`UPDATE ${table} SET deleted_at = NOW() WHERE id = $1 AND tenant_id = $2`, [
          id,
          tenantId,
        ])
        break
      default:
        return NextResponse.json({ error: "Invalid operation" }, { status: 400 })
    }

    return NextResponse.json({ data: result.rows })
  } catch (error) {
    console.error("Database proxy error:", error)
    return NextResponse.json({ error: "Database operation failed" }, { status: 500 })
  }
}
