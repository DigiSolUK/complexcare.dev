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
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Build the query conditions
    const conditions = []
    conditions.push(`a.care_professional_id = ${careProfessionalId}`)
    conditions.push(`a.tenant_id = ${tenantId}`)

    if (startDate) {
      conditions.push(`a.start_time >= ${startDate}`)
    }

    if (endDate) {
      conditions.push(`a.end_time <= ${endDate}`)
    }

    if (status) {
      conditions.push(`a.status = ${status}`)
    }

    // Get appointments for this care professional
    const appointments = await sql`
      SELECT 
        a.*,
        p.first_name as patient_first_name,
        p.last_name as patient_last_name,
        p.avatar_url as patient_avatar_url
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      WHERE ${conditions.join(" AND ")}
      ORDER BY a.start_time DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    // Get total count for pagination
    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM appointments
      WHERE care_professional_id = ${careProfessionalId} AND tenant_id = ${tenantId}
    `

    const total = countResult[0]?.total || 0

    // Return the appointments with pagination metadata
    return NextResponse.json({
      data: appointments,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error("Error fetching care professional appointments:", error)
    return NextResponse.json({ error: "Failed to fetch care professional appointments" }, { status: 500 })
  }
}
