import { NextResponse } from "next/server"
import { ClinicalNotesService } from "@/lib/services/clinical-notes-service"
import { getCurrentUser } from "@/lib/auth-utils"
import { z } from "zod"

const categoryUpdateSchema = z.object({
  name: z.string().min(1, "Category name is required").optional(),
  description: z.string().optional().nullable(),
})

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const clinicalNotesService = await ClinicalNotesService.create()
    const category = await clinicalNotesService.getCategoryById(params.id)

    if (!category) {
      return NextResponse.json({ message: "Clinical note category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Failed to fetch clinical note category:", error)
    return NextResponse.json({ message: "Failed to fetch clinical note category" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = categoryUpdateSchema.parse(body)

    const clinicalNotesService = await ClinicalNotesService.create()
    const updatedCategory = await clinicalNotesService.updateCategory(params.id, validatedData)

    if (!updatedCategory) {
      return NextResponse.json({ message: "Clinical note category not found or update failed" }, { status: 404 })
    }

    return NextResponse.json(updatedCategory)
  } catch (error: any) {
    console.error("Failed to update clinical note category:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ message: "Failed to update clinical note category" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const clinicalNotesService = await ClinicalNotesService.create()
    const success = await clinicalNotesService.deleteCategory(params.id)

    if (!success) {
      return NextResponse.json({ message: "Clinical note category not found or deletion failed" }, { status: 404 })
    }

    return NextResponse.json({ message: "Clinical note category deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Failed to delete clinical note category:", error)
    return NextResponse.json({ message: "Failed to delete clinical note category" }, { status: 500 })
  }
}
