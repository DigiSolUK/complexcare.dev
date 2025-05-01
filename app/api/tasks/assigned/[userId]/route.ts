import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Connect to the database
const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    // Check for demo mode
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return NextResponse.json([
        {
          id: "1",
          title: "Demo assigned task 1",
          description: "This is a demo task assigned to the user",
          status: "pending",
          priority: "high",
          dueDate: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tenant_id: "demo-tenant",
        },
        {
          id: "2",
          title: "Demo assigned task 2",
          description: "This is another demo task assigned to the user",
          status: "in-progress",
          priority: "medium",
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

    // Get user ID from params
    const userId = params.userId

    // Query tasks assigned to user using tagged template literal syntax
    const tasks = await sql`
      SELECT * FROM tasks
      WHERE assigned_to = ${userId} AND tenant_id = ${tenantId}
      ORDER BY due_date ASC, priority DESC
    `

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching assigned tasks:", error)
    return NextResponse.json({ error: "Failed to fetch assigned tasks" }, { status: 500 })
  }
}
