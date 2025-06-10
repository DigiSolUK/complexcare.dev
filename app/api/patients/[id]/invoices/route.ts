import { type NextRequest, NextResponse } from "next/server"
import { tenantQuery } from "@/lib/db-utils"

const DEFAULT_TENANT_ID = "ba367cfe-6de0-4180-9566-1002b75cf82c"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patientId = params.id

    // Get invoices for this patient
    const invoices = await tenantQuery(
      DEFAULT_TENANT_ID,
      `SELECT * FROM invoices 
       WHERE patient_id = $1 
       ORDER BY created_at DESC`,
      [patientId],
    )

    return NextResponse.json(invoices)
  } catch (error) {
    console.error("Error fetching patient invoices:", error)
    return NextResponse.json({ error: "Failed to fetch patient invoices" }, { status: 500 })
  }
}
