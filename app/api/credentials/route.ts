import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { z } from "zod"

const sql = neon(process.env.DATABASE_URL!)

const createCredentialSchema = z.object({
  care_professional_id: z.string().uuid(),
  credential_type: z.string().min(1),
  credential_number: z.string().min(1),
  issuer: z.string().min(1),
  issue_date: z.string().optional(),
  expiry_date: z.string().optional(),
  document_url: z.string().url().optional(),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tenantId = request.headers.get("x-tenant-id") || process.env.DEFAULT_TENANT_ID
    const careProfessionalId = searchParams.get("care_professional_id")

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    let query = `
      SELECT 
        pc.*,
        cp.first_name,
        cp.last_name,
        cp.role
      FROM professional_credentials pc
      JOIN care_professionals cp ON cp.id = pc.care_professional_id
      WHERE pc.tenant_id = $1
    `
    const params = [tenantId]

    if (careProfessionalId) {
      query += ` AND pc.care_professional_id = $2`
      params.push(careProfessionalId)
    }

    query += ` ORDER BY pc.created_at DESC`

    const result = await sql.query(query, params)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching credentials:", error)
    return NextResponse.json({ error: "Failed to fetch credentials" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const tenantId = request.headers.get("x-tenant-id") || process.env.DEFAULT_TENANT_ID
    const body = await request.json()

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const validatedData = createCredentialSchema.parse(body)

    const result = await sql`
      INSERT INTO professional_credentials (
        tenant_id,
        care_professional_id,
        credential_type,
        credential_number,
        issuer,
        issue_date,
        expiry_date,
        document_url,
        notes,
        verification_status,
        created_at,
        updated_at
      ) VALUES (
        ${tenantId},
        ${validatedData.care_professional_id},
        ${validatedData.credential_type},
        ${validatedData.credential_number},
        ${validatedData.issuer},
        ${validatedData.issue_date || null},
        ${validatedData.expiry_date || null},
        ${validatedData.document_url || null},
        ${validatedData.notes || null},
        'pending',
        NOW(),
        NOW()
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating credential:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input data", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create credential" }, { status: 500 })
  }
}
