import { type NextRequest, NextResponse } from "next/server"
import { tenantQuery } from "@/lib/db-utils"

const DEFAULT_TENANT_ID = "ba367cfe-6de0-4180-9566-1002b75cf82c"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patientId = params.id

    // Get care plans for this patient
    const carePlans = await tenantQuery(
      DEFAULT_TENANT_ID,
      `SELECT * FROM care_plans 
       WHERE patient_id = $1 
       ORDER BY start_date DESC`,
      [patientId],
    )

    return NextResponse.json(carePlans)
  } catch (error) {
    console.error("Error fetching patient care plans:", error)
    return NextResponse.json({ error: "Failed to fetch patient care plans" }, { status: 500 })
  }
}
