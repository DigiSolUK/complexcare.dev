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
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Get patients assigned to this care professional
    const patients = await sql`
      SELECT 
        p.*
      FROM patients p
      JOIN patient_care_professional pcp ON p.id = pcp.patient_id
      WHERE pcp.care_professional_id = ${careProfessionalId}
        AND p.tenant_id = ${tenantId}
      ORDER BY p.last_name, p.first_name
      LIMIT ${limit} OFFSET ${offset}
    `

    // Get total count for pagination
    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM patients p
      JOIN patient_care_professional pcp ON p.id = pcp.patient_id
      WHERE pcp.care_professional_id = ${careProfessionalId}
        AND p.tenant_id = ${tenantId}
    `

    const total = countResult[0]?.total || 0

    // Return the patients with pagination metadata
    return NextResponse.json({
      data: patients,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error("Error fetching care professional patients:", error)
    return NextResponse.json({ error: "Failed to fetch care professional patients" }, { status: 500 })
  }
}
