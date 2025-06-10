import { NextResponse } from "next/server"
import { ClinicalNotesService } from "@/lib/services/clinical-notes-service"
import { getCurrentUser } from "@/lib/auth-utils"
import { z } from "zod"

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional().nullable(),
})

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const clinicalNotesService = await ClinicalNotesService.create()
    const categories = await clinicalNotesService.getCategories()

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Failed to fetch clinical note categories:", error)
    return NextResponse.json({ message: "Failed to fetch clinical note categories" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = categorySchema.parse(body)

    const clinicalNotesService = await ClinicalNotesService.create()
    const newCategory = await clinicalNotesService.createCategory(validatedData)

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error: any) {
    console.error("Failed to create clinical note category:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ message: "Failed to create clinical note category" }, { status: 500 })
  }
}
