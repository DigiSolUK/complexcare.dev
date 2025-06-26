import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getSession } from "@/lib/auth"
import { patientSchema } from "@/lib/validations/patient-schema"
import { ZodError } from "zod"
import { v4 as uuidv4 } from "uuid"

const sql = neon(process.env.DATABASE_URL!)

// GET /api/patients - Fetch all patients for the current tenant
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: "Unauthorized or Tenant ID missing" }, { status: 401 })
    }
    const { tenantId } = session.user

    const patients = await sql`
      SELECT * FROM patients
      WHERE tenant_id = ${tenantId}
      ORDER BY last_name, first_name
    `
    return NextResponse.json(patients)
  } catch (error) {
    console.error("Error fetching patients:", error)
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 })
  }
}

// POST /api/patients - Create a new patient
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.tenantId || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized or Tenant/User ID missing" }, { status: 401 })
    }
    const { tenantId, id: userId } = session.user

    const body = await request.json()
    const validatedData = patientSchema.parse(body)

    const now = new Date().toISOString()
    const patientId = uuidv4()

    const result = await sql`
      INSERT INTO patients (
        id, tenant_id, first_name, last_name, date_of_birth, gender,
        contact_number, email, address, medical_record_number, primary_care_provider,
        avatar_url, status, created_at, updated_at, created_by, updated_by
      ) VALUES (
        ${patientId}, ${tenantId}, ${validatedData.first_name}, ${validatedData.last_name},
        ${validatedData.date_of_birth}, ${validatedData.gender}, ${validatedData.contact_number},
        ${validatedData.email}, ${validatedData.address ? JSON.stringify(validatedData.address) : null},
        ${validatedData.medical_record_number}, ${validatedData.primary_care_provider},
        ${validatedData.avatar_url}, ${validatedData.status},
        ${now}, ${now}, ${userId}, ${userId}
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }
    console.error("Error creating patient:", error)
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 })
  }
}
