import { type NextRequest, NextResponse } from "next/server"
import { tenantQuery } from "@/lib/db-utils"

const DEFAULT_TENANT_ID = "ba367cfe-6de0-4180-9566-1002b75cf82c"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patientId = params.id

    // Get appointments for this patient
    const appointments = await tenantQuery(
      DEFAULT_TENANT_ID,
      `SELECT * FROM appointments 
       WHERE patient_id = $1 
       ORDER BY start_time DESC`,
      [patientId],
    )

    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Error fetching patient appointments:", error)
    return NextResponse.json({ error: "Failed to fetch patient appointments" }, { status: 500 })
  }
}
