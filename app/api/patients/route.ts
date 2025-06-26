import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getSession } from "@/lib/auth"
import { patientSchema } from "@/lib/validations/patient-schema"
import { ZodError } from "zod"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: "Unauthorized or Tenant ID missing" }, { status: 401 })
    }
    const { tenantId } = session.user

    const patients = await sql`
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
      WHERE tenant_id = ${tenantId}
      ORDER BY created_at DESC
    `
    return NextResponse.json(patients)
  } catch (error) {
    console.error("Error fetching patients:", error)
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.tenantId || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized or Tenant/User ID missing" }, { status: 401 })
    }
    const { tenantId, id: userId } = session.user

    const body = await request.json()
    const validatedData = patientSchema.parse(body)

    const {
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
    } = validatedData

    const result = await sql`
      INSERT INTO patients (
        tenant_id,
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
        created_by
      ) VALUES (
        ${tenantId},
        ${first_name},
        ${last_name},
        ${date_of_birth},
        ${gender},
        ${contact_number},
        ${email},
        ${address ? JSON.stringify(address) : null}::jsonb,
        ${medical_record_number},
        ${primary_care_provider},
        ${avatar_url},
        ${status},
        ${medical_history ? JSON.stringify(medical_history) : null}::jsonb,
        ${allergies ? JSON.stringify(allergies) : null}::jsonb,
        ${chronic_conditions ? JSON.stringify(chronic_conditions) : null}::jsonb,
        ${past_surgeries ? JSON.stringify(past_surgeries) : null}::jsonb,
        ${family_medical_history ? JSON.stringify(family_medical_history) : null}::jsonb,
        ${immunizations ? JSON.stringify(immunizations) : null}::jsonb,
        ${userId}
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
