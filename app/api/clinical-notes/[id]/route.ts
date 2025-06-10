import { NextResponse } from "next/server"
import { ClinicalNotesService } from "@/lib/services/clinical-notes-service"
import { getCurrentUser } from "@/lib/auth-utils"
import { z } from "zod"

const clinicalNoteUpdateSchema = z.object({
  patientId: z.string().uuid("Invalid patient ID").optional(),
  careProfessionalId: z.string().uuid("Invalid care professional ID").optional(),
  categoryId: z.string().uuid("Invalid category ID").optional(),
  templateId: z.string().uuid("Invalid template ID").optional().nullable(),
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().min(1, "Content is required").optional(),
  noteDate: z.string().datetime("Invalid date format").optional(),
})

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const clinicalNotesService = await ClinicalNotesService.create()
    const note = await clinicalNotesService.getNoteById(params.id)

    if (!note) {
      return NextResponse.json({ message: "Clinical note not found" }, { status: 404 })
    }

    return NextResponse.json(note)
  } catch (error) {
    console.error("Failed to fetch clinical note:", error)
    return NextResponse.json({ message: "Failed to fetch clinical note" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = clinicalNoteUpdateSchema.parse(body)

    const clinicalNotesService = await ClinicalNotesService.create()
    const updatedNote = await clinicalNotesService.updateNote(params.id, {
      ...validatedData,
      noteDate: validatedData.noteDate ? new Date(validatedData.noteDate) : undefined,
    })

    if (!updatedNote) {
      return NextResponse.json({ message: "Clinical note not found or update failed" }, { status: 404 })
    }

    return NextResponse.json(updatedNote)
  } catch (error: any) {
    console.error("Failed to update clinical note:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ message: "Failed to update clinical note" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const clinicalNotesService = await ClinicalNotesService.create()
    const success = await clinicalNotesService.deleteNote(params.id)

    if (!success) {
      return NextResponse.json({ message: "Clinical note not found or deletion failed" }, { status: 404 })
    }

    return NextResponse.json({ message: "Clinical note deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Failed to delete clinical note:", error)
    return NextResponse.json({ message: "Failed to delete clinical note" }, { status: 500 })
  }
}
