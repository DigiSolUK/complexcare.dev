import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { z } from "zod"
import { buildUpdateQuery } from "@/lib/db-utils"

const sql = neon(process.env.DATABASE_URL!)

const updateCredentialSchema = z.object({
  credential_type: z.string().min(1).optional(),
  credential_number: z.string().min(1).optional(),
  issuer: z.string().min(1).optional(),
  issue_date: z.string().optional(),
  expiry_date: z.string().optional(),
  document_url: z.string().url().optional(),
  notes: z.string().optional(),
  verification_status: z.enum(["pending", "verified", "rejected", "expired"]).optional(),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tenantId = request.headers.get("x-tenant-id") || process.env.DEFAULT_TENANT_ID
    const { id } = params

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const result = await sql`
      SELECT 
        pc.*,
        cp.first_name,
        cp.last_name,
        cp.role
      FROM professional_credentials pc
      JOIN care_professionals cp ON cp.id = pc.care_professional_id
      WHERE pc.id = ${id} AND pc.tenant_id = ${tenantId}
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tenantId = request.headers.get("x-tenant-id") || process.env.DEFAULT_TENANT_ID
    const { id } = params
    const body = await request.json()

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const validatedData = updateCredentialSchema.parse(body)
    const dataWithTimestamp = { ...validatedData, updated_at: new Date().toISOString() }

    const { query, values } = buildUpdateQuery("professional_credentials", dataWithTimestamp, {
      id,
      tenant_id: tenantId,
    })

    const result = await sql.query(query, values)

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Credential not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error updating credential:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input data", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update credential" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tenantId = request.headers.get("x-tenant-id") || process.env.DEFAULT_TENANT_ID
    const { id } = params

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const result = await sql`
      DELETE FROM professional_credentials
      WHERE id = ${id} AND tenant_id = ${tenantId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Credential not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Credential deleted successfully" })
  } catch (error) {
    console.error("Error deleting credential:", error)
    return NextResponse.json({ error: "Failed to delete credential" }, { status: 500 })
  }
}
