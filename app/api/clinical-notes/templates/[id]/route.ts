import { NextResponse } from "next/server"
import { ClinicalNotesService } from "@/lib/services/clinical-notes-service"
import { getCurrentUser } from "@/lib/auth-utils"
import { z } from "zod"

const templateUpdateSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID").optional(),
  name: z.string().min(1, "Template name is required").optional(),
  content: z.string().min(1, "Template content is required").optional(),
})

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const clinicalNotesService = await ClinicalNotesService.create()
    const template = await clinicalNotesService.getTemplateById(params.id)

    if (!template) {
      return NextResponse.json({ message: "Clinical note template not found" }, { status: 404 })
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error("Failed to fetch clinical note template:", error)
    return NextResponse.json({ message: "Failed to fetch clinical note template" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = templateUpdateSchema.parse(body)

    const clinicalNotesService = await ClinicalNotesService.create()
    const updatedTemplate = await clinicalNotesService.updateTemplate(params.id, validatedData)

    if (!updatedTemplate) {
      return NextResponse.json({ message: "Clinical note template not found or update failed" }, { status: 404 })
    }

    return NextResponse.json(updatedTemplate)
  } catch (error: any) {
    console.error("Failed to update clinical note template:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ message: "Failed to update clinical note template" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const clinicalNotesService = await ClinicalNotesService.create()
    const success = await clinicalNotesService.deleteTemplate(params.id)

    if (!success) {
      return NextResponse.json({ message: "Clinical note template not found or deletion failed" }, { status: 404 })
    }

    return NextResponse.json({ message: "Clinical note template deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Failed to delete clinical note template:", error)
    return NextResponse.json({ message: "Failed to delete clinical note template" }, { status: 500 })
  }
}
