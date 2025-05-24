import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getTenantIdFromRequest } from "@/lib/tenant-utils"
import { getCurrentUser } from "@/lib/auth-utils"

// Initialize the database connection
const sql = neon(process.env.DATABASE_URL || "")

export async function POST(request: NextRequest, { params }: { params: { id: string; credentialId: string } }) {
  try {
    const careProfessionalId = params.id
    const credentialId = params.credentialId
    const body = await request.json()

    // Get tenant ID from request headers or query parameters
    const tenantId = getTenantIdFromRequest(request)

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    // Get current user for verification
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Validate status
    if (!body.status || !["verified", "rejected"].includes(body.status)) {
      return NextResponse.json({ error: "Valid verification status is required" }, { status: 400 })
    }

    // Update the credential verification status
    const result = await sql`
      UPDATE professional_credentials
      SET 
        verification_status = ${body.status},
        verified_by = ${currentUser.id},
        verification_date = NOW(),
        verification_notes = ${body.notes || null},
        updated_at = NOW()
      WHERE id = ${credentialId}
        AND user_id = ${careProfessionalId}
        AND tenant_id = ${tenantId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Credential not found or verification failed" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error verifying credential:", error)
    return NextResponse.json({ error: "Failed to verify credential" }, { status: 500 })
  }
}
