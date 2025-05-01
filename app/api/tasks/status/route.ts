import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Connect to the database
const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    // Check for demo mode
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return NextResponse.json({
        pending: 10,
        inProgress: 5,
        completed: 15,
        overdue: 2,
      })
    }

    // Get tenant ID from request
    const url = new URL(request.url)
    const tenantId =
      request.headers.get("x-tenant-id") || url.searchParams.get("tenantId") || process.env.DEFAULT_TENANT_ID

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    // Query task counts by status using tagged template literal syntax
    const statusCounts = await sql`
      SELECT status, COUNT(*) as count
      FROM tasks
      WHERE tenant_id = ${tenantId}
      GROUP BY status
    `

    // Query overdue tasks count using tagged template literal syntax
    const overdueTasks = await sql`
      SELECT COUNT(*) as count
      FROM tasks
      WHERE 
        tenant_id = ${tenantId} AND 
        due_date < NOW() AND 
        status NOT IN ('completed', 'cancelled')
    `

    // Format the response
    const result = {
      statusCounts,
      overdueTasks: Number.parseInt(overdueTasks[0]?.count || "0"),
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching task statistics:", error)
    return NextResponse.json({ error: "Failed to fetch task statistics" }, { status: 500 })
  }
}
