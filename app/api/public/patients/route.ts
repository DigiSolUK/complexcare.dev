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

    // Query patients with proper SQL syntax
    const patients = await sql`
    SELECT id, first_name, last_name, date_of_birth, gender, nhs_number, status, created_at, updated_at
    FROM patients
    WHERE tenant_id = ${tenantId}
    LIMIT 10
  `

    return NextResponse.json(patients)
  } catch (error) {
    console.error("Error fetching patients:", error)
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 })
  }
}
