import { type NextRequest, NextResponse } from "next/server"
import { tenantQuery } from "@/lib/db-utils"

const DEFAULT_TENANT_ID = "ba367cfe-6de0-4180-9566-1002b75cf82c"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patientId = params.id

    // Get clinical notes for this patient with category information
    const clinicalNotes = await tenantQuery(
      DEFAULT_TENANT_ID,
      `SELECT n.*, c.name as category_name, c.color as category_color, 
              u.name as created_by_name
       FROM clinical_notes n
       LEFT JOIN clinical_note_categories c ON n.category_id = c.id
       LEFT JOIN users u ON n.created_by = u.id
       WHERE n.patient_id = $1 
       ORDER BY n.created_at DESC`,
      [patientId],
    )

    return NextResponse.json(clinicalNotes)
  } catch (error) {
    console.error("Error fetching patient clinical notes:", error)
    return NextResponse.json({ error: "Failed to fetch patient clinical notes" }, { status: 500 })
  }
}
