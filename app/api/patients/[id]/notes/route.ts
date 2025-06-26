import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getPatientNotesByPatientId } from "@/lib/services/patient-note-service"
import { logError } from "@/lib/services/error-logging-service"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const tenantId = session.user.tenantId
    const patientId = params.id

    if (!tenantId) {
      await logError({
        message: "Tenant ID not found in session for fetching patient notes.",
        component_path: "/api/patients/[id]/notes/route.ts",
        user_id: session.user.id,
        severity: "high",
      })
      return NextResponse.json({ message: "Tenant ID not found" }, { status: 400 })
    }

    const notes = await getPatientNotesByPatientId(tenantId, patientId)
    return NextResponse.json(notes)
  } catch (error: any) {
    console.error(`Failed to fetch notes for patient ${params.id}:`, error)
    await logError({
      message: `Failed to fetch notes for patient ${params.id}: ${error.message}`,
      stack: error.stack,
      component_path: "/api/patients/[id]/notes/route.ts",
      status_code: 500,
      severity: "critical",
    })
    return NextResponse.json({ message: "Failed to fetch patient notes", error: error.message }, { status: 500 })
  }
}
