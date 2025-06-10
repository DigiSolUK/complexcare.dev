import { NextResponse } from "next/server"
import { ClinicalNotesService } from "@/lib/services/clinical-notes-service"
import { getCurrentUser } from "@/lib/auth-utils"
import { z } from "zod"

const clinicalNoteSchema = z.object({
  patientId: z.string().uuid("Invalid patient ID"),
  careProfessionalId: z.string().uuid("Invalid care professional ID"),
  categoryId: z.string().uuid("Invalid category ID"),
  templateId: z.string().uuid("Invalid template ID").optional().nullable(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  noteDate: z.string().datetime("Invalid date format"),
})

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patientId") || undefined

    const clinicalNotesService = await ClinicalNotesService.create()
    const notes = await clinicalNotesService.getNotes(patientId)

    return NextResponse.json(notes)
  } catch (error) {
    console.error("Failed to fetch clinical notes:", error)
    return NextResponse.json({ message: "Failed to fetch clinical notes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = clinicalNoteSchema.parse(body)

    const clinicalNotesService = await ClinicalNotesService.create()
    const newNote = await clinicalNotesService.createNote({
      ...validatedData,
      noteDate: new Date(validatedData.noteDate),
    })

    return NextResponse.json(newNote, { status: 201 })
  } catch (error: any) {
    console.error("Failed to create clinical note:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ message: "Failed to create clinical note" }, { status: 500 })
  }
}
