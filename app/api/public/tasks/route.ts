import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: Request) {
  try {
    // Get tenant ID from request
    const url = new URL(request.url)
    const tenantId =
      request.headers.get("x-tenant-id") || url.searchParams.get("tenantId") || process.env.DEFAULT_TENANT_ID

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    // Connect to database
    const sql = neon(process.env.DATABASE_URL)

    // Query tasks with proper SQL syntax
    const tasks = await sql`
    SELECT id, title, description, status, priority, due_date, assigned_to, created_at, updated_at
    FROM tasks
    WHERE tenant_id = ${tenantId}
    LIMIT 10
  `

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}
