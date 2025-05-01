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

    // Query care professionals with proper SQL syntax
    const careProfessionals = await sql`
    SELECT id, first_name, last_name, email, phone, role, specialization, qualification, 
           license_number, employment_status, is_active, created_at, updated_at
    FROM care_professionals
    WHERE tenant_id = ${tenantId}
    LIMIT 10
  `

    return NextResponse.json(careProfessionals)
  } catch (error) {
    console.error("Error fetching care professionals:", error)
    return NextResponse.json({ error: "Failed to fetch care professionals" }, { status: 500 })
  }
}
