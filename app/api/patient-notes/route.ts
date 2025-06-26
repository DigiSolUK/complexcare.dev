import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { createPatientNote } from "@/lib/services/patient-note-service"
import { logError } from "@/lib/services/error-logging-service"
import { patientNoteSchema } from "@/lib/validations/patient-note-schema"
import { ZodError } from "zod"

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.tenantId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const { tenantId } = session.user

    const body = await req.json()
    const validatedData = patientNoteSchema.parse(body)

    const newNote = await createPatientNote(tenantId, validatedData.patient_id, {
      care_professional_id: validatedData.care_professional_id,
      note_type: validatedData.note_type,
      content: validatedData.content,
      is_private: validatedData.is_private,
    })

    return NextResponse.json(newNote, { status: 201 })
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }
    console.error("Failed to create patient note:", error)
    await logError({
      message: `Failed to create patient note: ${error.message}`,
      stack: error.stack,
      component_path: "/api/patient-notes/route.ts",
      request_data: req.json(),
      status_code: 500,
      severity: "critical",
    })
    return NextResponse.json({ message: "Failed to create patient note", error: error.message }, { status: 500 })
  }
}
