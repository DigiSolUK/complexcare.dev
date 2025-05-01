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

    // Get credentials for this care professional
    const credentials = await sql`
      SELECT *
      FROM professional_credentials
      WHERE user_id = ${careProfessionalId} AND tenant_id = ${tenantId}
      ORDER BY created_at DESC
    `

    // Return the credentials
    return NextResponse.json(credentials)
  } catch (error) {
    console.error("Error fetching care professional credentials:", error)
    return NextResponse.json({ error: "Failed to fetch care professional credentials" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const careProfessionalId = params.id

    // Get tenant ID from request headers or query parameters
    const tenantId = getTenantIdFromRequest(request)

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    // Parse the request body
    const body = await request.json()

    // Validate required fields
    if (!body.credential_type || !body.credential_number) {
      return NextResponse.json({ error: "Credential type and number are required" }, { status: 400 })
    }

    // Check if the care professional exists
    const careProfessional = await sql`
      SELECT id FROM care_professionals
      WHERE id = ${careProfessionalId} AND tenant_id = ${tenantId}
    `

    if (careProfessional.length === 0) {
      return NextResponse.json({ error: "Care professional not found" }, { status: 404 })
    }

    // Insert the new credential
    const result = await sql`
      INSERT INTO professional_credentials (
        tenant_id,
        user_id,
        credential_type,
        credential_number,
        issuing_authority,
        issue_date,
        expiry_date,
        verification_status,
        verification_date,
        verified_by,
        notes,
        created_at,
        updated_at
      ) VALUES (
        ${tenantId},
        ${careProfessionalId},
        ${body.credential_type},
        ${body.credential_number},
        ${body.issuing_authority || null},
        ${body.issue_date || null},
        ${body.expiry_date || null},
        ${body.verification_status || "pending"},
        ${body.verification_date || null},
        ${body.verified_by || null},
        ${body.notes || null},
        NOW(),
        NOW()
      )
      RETURNING *
    `

    // Return the newly created credential
    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating care professional credential:", error)
    return NextResponse.json({ error: "Failed to create care professional credential" }, { status: 500 })
  }
}
