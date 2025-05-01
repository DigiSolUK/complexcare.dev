import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getTenantIdFromRequest } from "@/lib/tenant-utils"

// Initialize the database connection
const sql = neon(process.env.DATABASE_URL || "")

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const careProfessionalId = params.id

    // Get tenant ID from request headers or query parameters
    const tenantId = getTenantIdFromRequest(request)

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    // Get search parameters
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Build the query conditions
    const conditions = []
    conditions.push(`t.assigned_to = ${careProfessionalId}`)
    conditions.push(`t.tenant_id = ${tenantId}`)

    if (status) {
      conditions.push(`t.status = ${status}`)
    }

    if (priority) {
      conditions.push(`t.priority = ${priority}`)
    }

    // Get tasks for this care professional
    const tasks = await sql`
      SELECT 
        t.*,
        p.first_name as patient_first_name,
        p.last_name as patient_last_name,
        p.avatar_url as patient_avatar_url,
        cp.first_name as assigned_by_first_name,
        cp.last_name as assigned_by_last_name
      FROM tasks t
      LEFT JOIN patients p ON t.patient_id = p.id
      LEFT JOIN care_professionals cp ON t.assigned_by = cp.id
      WHERE ${conditions.join(" AND ")}
      ORDER BY 
        CASE 
          WHEN t.priority = 'high' THEN 1
          WHEN t.priority = 'medium' THEN 2
          WHEN t.priority = 'low' THEN 3
          ELSE 4
        END,
        t.due_date ASC
      LIMIT ${limit} OFFSET ${offset}
    `

    // Get total count for pagination
    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM tasks
      WHERE assigned_to = ${careProfessionalId} AND tenant_id = ${tenantId}
    `

    const total = countResult[0]?.total || 0

    // Return the tasks with pagination metadata
    return NextResponse.json({
      data: tasks,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error("Error fetching care professional tasks:", error)
    return NextResponse.json({ error: "Failed to fetch care professional tasks" }, { status: 500 })
  }
}
