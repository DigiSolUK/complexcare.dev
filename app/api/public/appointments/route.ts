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

    // Query appointments with proper SQL syntax
    const appointments = await sql`
    SELECT a.id, a.title, a.description, a.start_time, a.end_time, a.location, a.status,
           p.first_name as patient_first_name, p.last_name as patient_last_name,
           cp.first_name as care_professional_first_name, cp.last_name as care_professional_last_name
    FROM appointments a
    LEFT JOIN patients p ON a.patient_id = p.id
    LEFT JOIN care_professionals cp ON a.care_professional_id = cp.id
    WHERE a.tenant_id = ${tenantId}
    LIMIT 10
  `

    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 })
  }
}
