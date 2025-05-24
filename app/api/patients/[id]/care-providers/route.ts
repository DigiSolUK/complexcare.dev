import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const patientId = params.id
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenantId") || user.tenantId
    const includeEnded = searchParams.get("includeEnded") === "true"
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    // Get all care professionals assigned to this patient
    const sql = neon(process.env.DATABASE_URL || "")

    let query = `
      SELECT pa.*, 
             cp.first_name, cp.last_name, cp.role, cp.title,
             cp.specialization, cp.avatar_url
      FROM patient_assignments pa
      JOIN care_professionals cp ON pa.care_professional_id = cp.id
      WHERE pa.patient_id = $1
      AND pa.tenant_id = $2
    `

    if (!includeEnded) {
      query += ` AND (pa.end_date IS NULL OR pa.end_date >= CURRENT_DATE)`
    }

    query += ` 
      ORDER BY pa.start_date DESC
      LIMIT $3
    `

    const careProviders = await sql.query(query, [patientId, tenantId, limit])

    return NextResponse.json({ data: careProviders.rows })
  } catch (error) {
    console.error("Error fetching patient care providers:", error)
    return NextResponse.json({ error: "Failed to fetch patient care providers" }, { status: 500 })
  }
}
