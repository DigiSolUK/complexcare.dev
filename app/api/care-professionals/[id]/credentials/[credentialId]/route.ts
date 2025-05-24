import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getTenantIdFromRequest } from "@/lib/tenant-utils"

// Initialize the database connection
const sql = neon(process.env.DATABASE_URL || "")

export async function GET(request: NextRequest, { params }: { params: { id: string; credentialId: string } }) {
  try {
    const careProfessionalId = params.id
    const credentialId = params.credentialId

    // Get tenant ID from request headers or query parameters
    const tenantId = getTenantIdFromRequest(request)

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    // Get credential details
    const result = await sql`
      SELECT c.*, 
        cp.first_name || ' ' || cp.last_name as professional_name,
        v.first_name || ' ' || v.last_name as verifier_name
      FROM professional_credentials c
      LEFT JOIN care_professionals cp ON c.user_id = cp.id
      LEFT JOIN care_professionals v ON c.verified_by = v.id
      WHERE c.id = ${credentialId}
        AND c.user_id = ${careProfessionalId}
        AND c.tenant_id = ${tenantId}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Credential not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching credential:", error)
    return NextResponse.json({ error: "Failed to fetch credential" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string; credentialId: string } }) {
  try {
    const careProfessionalId = params.id
    const credentialId = params.credentialId
    const body = await request.json()

    // Get tenant ID from request headers or query parameters
    const tenantId = getTenantIdFromRequest(request)

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    // Validate required fields
    if (!body.credential_type || !body.credential_number) {
      return NextResponse.json({ error: "Credential type and number are required" }, { status: 400 })
    }

    // Update the credential
    const result = await sql`
      UPDATE professional_credentials
      SET 
        credential_type = ${body.credential_type},
        credential_number = ${body.credential_number},
        issuing_authority = ${body.issuing_authority || null},
        issue_date = ${body.issue_date || null},
        expiry_date = ${body.expiry_date || null},
        document_url = ${body.document_url || null},
        notes = ${body.notes || null},
        updated_at = NOW()
      WHERE id = ${credentialId}
        AND user_id = ${careProfessionalId}
        AND tenant_id = ${tenantId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Credential not found or update failed" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating credential:", error)
    return NextResponse.json({ error: "Failed to update credential" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string; credentialId: string } }) {
  try {
    const careProfessionalId = params.id
    const credentialId = params.credentialId

    // Get tenant ID from request headers or query parameters
    const tenantId = getTenantIdFromRequest(request)

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    // Delete the credential
    const result = await sql`
      DELETE FROM professional_credentials
      WHERE id = ${credentialId}
        AND user_id = ${careProfessionalId}
        AND tenant_id = ${tenantId}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Credential not found or delete failed" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting credential:", error)
    return NextResponse.json({ error: "Failed to delete credential" }, { status: 500 })
  }
}
