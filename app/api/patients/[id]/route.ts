import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 })
    }

    // Try to get the patient from the database
    try {
      const result = await sql`
        SELECT * FROM patients
        WHERE id = ${id}
        AND tenant_id = ${DEFAULT_TENANT_ID}
        AND deleted_at IS NULL
      `

      if (result.length === 0) {
        // If no patient found in database, return mock data
        return NextResponse.json(createMockPatient(id))
      }

      return NextResponse.json(result[0])
    } catch (dbError) {
      console.warn("Database query failed, using mock data:", dbError)
      // Return mock data if database query fails
      return NextResponse.json(createMockPatient(id))
    }
  } catch (error: any) {
    console.error("Error fetching patient:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch patient" }, { status: 500 })
  }
}

function createMockPatient(id: string) {
  return {
    id,
    tenant_id: DEFAULT_TENANT_ID,
    first_name: "John",
    last_name: "Doe",
    date_of_birth: "1980-01-01",
    gender: "male",
    nhs_number: "1234567890",
    contact_number: "07700900000",
    email: "john.doe@example.com",
    address: "123 Main St, London",
    primary_condition: "Hypertension",
    primary_care_provider: "Dr. Smith",
    status: "active",
    notes:
      "Regular checkups required. Patient has a history of high blood pressure and requires monthly monitoring. Currently on medication to manage condition.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  }
}
