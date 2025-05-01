import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Connect to the database
const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    // Check for demo mode
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return NextResponse.json([
        {
          id: "1",
          title: "Demo related task 1",
          description: "This is a demo related task",
          status: "pending",
          priority: "high",
          dueDate: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tenant_id: "demo-tenant",
        },
      ])
    }

    // Get tenant ID from request
    const url = new URL(request.url)
    const tenantId =
      request.headers.get("x-tenant-id") || url.searchParams.get("tenantId") || process.env.DEFAULT_TENANT_ID

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    // Get related entity type and ID from query params
    const relatedToType = url.searchParams.get("type")
    const relatedToId = url.searchParams.get("id")

    if (!relatedToType || !relatedToId) {
      return NextResponse.json({ error: "Related type and ID are required" }, { status: 400 })
    }

    // Query related tasks using tagged template literal syntax
    const tasks = await sql`
      SELECT * FROM tasks
      WHERE 
        tenant_id = ${tenantId} AND 
        related_to_type = ${relatedToType} AND 
        related_to_id = ${relatedToId}
      ORDER BY due_date ASC, priority DESC
    `

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching related tasks:", error)
    return NextResponse.json({ error: "Failed to fetch related tasks" }, { status: 500 })
  }
}
