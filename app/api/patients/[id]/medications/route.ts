import { type NextRequest, NextResponse } from "next/server"
import { tenantQuery } from "@/lib/db-utils"

const DEFAULT_TENANT_ID = "ba367cfe-6de0-4180-9566-1002b75cf82c"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patientId = params.id

    // Get medications for this patient
    const medications = await tenantQuery(
      DEFAULT_TENANT_ID,
      `SELECT * FROM medications 
       WHERE patient_id = $1 
       ORDER BY name`,
      [patientId],
    )

    return NextResponse.json(medications)
  } catch (error) {
    console.error("Error fetching patient medications:", error)
    return NextResponse.json({ error: "Failed to fetch patient medications" }, { status: 500 })
  }
}
