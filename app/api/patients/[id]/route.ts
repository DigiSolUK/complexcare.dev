import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getSession } from "@/lib/auth"
import { updatePatientSchema } from "@/lib/validations/patient-schema"
import { buildUpdateQuery } from "@/lib/db-utils"
import { ZodError } from "zod"

const sql = neon(process.env.DATABASE_URL!)

// GET a single patient
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: "Unauthorized or Tenant ID missing" }, { status: 401 })
    }
    const { tenantId } = session.user
    const { id } = params

    const result = await sql`
      SELECT
        id,
        first_name,
        last_name,
        date_of_birth,
        gender,
        contact_number,
        email,
        address,
        medical_record_number,
        primary_care_provider,
        avatar_url,
        status,
        medical_history,
        allergies,
        chronic_conditions,
        past_surgeries,
        family_medical_history,
        immunizations,
        created_at,
        updated_at
      FROM patients
      WHERE id = ${id} AND tenant_id = ${tenantId}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error(`Error fetching patient ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch patient" }, { status: 500 })
  }
}

// UPDATE a patient
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session?.user?.tenantId || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized or Tenant/User ID missing" }, { status: 401 })
    }
    const { tenantId, id: userId } = session.user
    const { id } = params

    const body = await request.json()
    const validatedData = updatePatientSchema.parse(body)

    if (Object.keys(validatedData).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    // Convert array fields to JSON strings if they exist
    const dataToUpdate: Record<string, any> = { ...validatedData }
    if (dataToUpdate.allergies !== undefined) {
      dataToUpdate.allergies = dataToUpdate.allergies ? JSON.stringify(dataToUpdate.allergies) : null
    }
    if (dataToUpdate.chronic_conditions !== undefined) {
      dataToUpdate.chronic_conditions = dataToUpdate.chronic_conditions
        ? JSON.stringify(dataToUpdate.chronic_conditions)
        : null
    }
    if (dataToUpdate.past_surgeries !== undefined) {
      dataToUpdate.past_surgeries = dataToUpdate.past_surgeries ? JSON.stringify(dataToUpdate.past_surgeries) : null
    }
    if (dataToUpdate.immunizations !== undefined) {
      dataToUpdate.immunizations = dataToUpdate.immunizations ? JSON.stringify(dataToUpdate.immunizations) : null
    }
    if (dataToUpdate.medical_history !== undefined) {
      dataToUpdate.medical_history = dataToUpdate.medical_history ? JSON.stringify(dataToUpdate.medical_history) : null
    }
    if (dataToUpdate.family_medical_history !== undefined) {
      dataToUpdate.family_medical_history = dataToUpdate.family_medical_history
        ? JSON.stringify(dataToUpdate.family_medical_history)
        : null
    }
    if (dataToUpdate.address !== undefined) {
      dataToUpdate.address = dataToUpdate.address ? JSON.stringify(dataToUpdate.address) : null
    }

    const dataWithUpdater = { ...dataToUpdate, updated_by: userId }

    const { query, values } = buildUpdateQuery("patients", dataWithUpdater, { id, tenant_id: tenantId })

    const result = await sql.query(query, values)

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Patient not found or update failed" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }
    console.error(`Error updating patient ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update patient" }, { status: 500 })
  }
}

// DELETE a patient (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session?.user?.tenantId || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { tenantId, id: userId } = session.user
    const { id } = params

    const result = await sql`
            UPDATE patients
            SET status = 'inactive', updated_at = NOW(), updated_by = ${userId}
            WHERE id = ${id} AND tenant_id = ${tenantId}
            RETURNING id, status
        `

    if (result.length === 0) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Patient deactivated successfully", data: result[0] })
  } catch (error) {
    console.error(`Error deactivating patient ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to deactivate patient" }, { status: 500 })
  }
}
