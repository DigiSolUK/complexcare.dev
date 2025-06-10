import { NextResponse } from "next/server"
import { ClinicalNotesService } from "@/lib/services/clinical-notes-service"
import { getCurrentUser } from "@/lib/auth-utils"
import { z } from "zod"

const templateSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID"),
  name: z.string().min(1, "Template name is required"),
  content: z.string().min(1, "Template content is required"),
})

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId") || undefined

    const clinicalNotesService = await ClinicalNotesService.create()
    const templates = await clinicalNotesService.getTemplates(categoryId)

    return NextResponse.json(templates)
  } catch (error) {
    console.error("Failed to fetch clinical note templates:", error)
    return NextResponse.json({ message: "Failed to fetch clinical note templates" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = templateSchema.parse(body)

    const clinicalNotesService = await ClinicalNotesService.create()
    const newTemplate = await clinicalNotesService.createTemplate(validatedData)

    return NextResponse.json(newTemplate, { status: 201 })
  } catch (error: any) {
    console.error("Failed to create clinical note template:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ message: "Failed to create clinical note template" }, { status: 500 })
  }
}
