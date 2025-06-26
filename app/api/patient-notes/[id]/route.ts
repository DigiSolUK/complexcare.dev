import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getPatientNoteById, updatePatientNote, deletePatientNote } from "@/lib/services/patient-note-service"
import { logError } from "@/lib/services/error-logging-service"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const tenantId = session.user.tenantId
    const noteId = params.id

    if (!tenantId) {
      await logError({
        message: "Tenant ID not found in session for fetching patient note.",
        component_path: "/api/patient-notes/[id]/route.ts",
        user_id: session.user.id,
        severity: "high",
      })
      return NextResponse.json({ message: "Tenant ID not found" }, { status: 400 })
    }

    const note = await getPatientNoteById(tenantId, noteId)

    if (!note) {
      return NextResponse.json({ message: "Patient note not found" }, { status: 404 })
    }

    return NextResponse.json(note)
  } catch (error: any) {
    console.error(`Failed to fetch patient note ${params.id}:`, error)
    await logError({
      message: `Failed to fetch patient note ${params.id}: ${error.message}`,
      stack: error.stack,
      component_path: "/api/patient-notes/[id]/route.ts",
      status_code: 500,
      severity: "critical",
    })
    return NextResponse.json({ message: "Failed to fetch patient note", error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const tenantId = session.user.tenantId
    const noteId = params.id

    if (!tenantId) {
      await logError({
        message: "Tenant ID not found in session for updating patient note.",
        component_path: "/api/patient-notes/[id]/route.ts",
        user_id: session.user.id,
        severity: "high",
      })
      return NextResponse.json({ message: "Tenant ID not found" }, { status: 400 })
    }

    const { note_type, content, is_private } = await req.json()

    const updatedNote = await updatePatientNote(tenantId, noteId, {
      note_type,
      content,
      is_private,
    })

    if (!updatedNote) {
      return NextResponse.json({ message: "Patient note not found or failed to update" }, { status: 404 })
    }

    return NextResponse.json(updatedNote)
  } catch (error: any) {
    console.error(`Failed to update patient note ${params.id}:`, error)
    await logError({
      message: `Failed to update patient note ${params.id}: ${error.message}`,
      stack: error.stack,
      component_path: "/api/patient-notes/[id]/route.ts",
      request_data: req.json(),
      status_code: 500,
      severity: "critical",
    })
    return NextResponse.json({ message: "Failed to update patient note", error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const tenantId = session.user.tenantId
    const noteId = params.id

    if (!tenantId) {
      await logError({
        message: "Tenant ID not found in session for deleting patient note.",
        component_path: "/api/patient-notes/[id]/route.ts",
        user_id: session.user.id,
        severity: "high",
      })
      return NextResponse.json({ message: "Tenant ID not found" }, { status: 400 })
    }

    const success = await deletePatientNote(tenantId, noteId)

    if (!success) {
      return NextResponse.json({ message: "Patient note not found or failed to delete" }, { status: 404 })
    }

    return NextResponse.json({ message: "Patient note deleted successfully" }, { status: 200 })
  } catch (error: any) {
    console.error(`Failed to delete patient note ${params.id}:`, error)
    await logError({
      message: `Failed to delete patient note ${params.id}: ${error.message}`,
      stack: error.stack,
      component_path: "/api/patient-notes/[id]/route.ts",
      status_code: 500,
      severity: "critical",
    })
    return NextResponse.json({ message: "Failed to delete patient note", error: error.message }, { status: 500 })
  }
}
