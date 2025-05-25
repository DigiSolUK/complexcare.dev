import { NextResponse } from "next/server"
import { getClinicalNoteCategories, createClinicalNoteCategory } from "@/lib/services/clinical-notes-service"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

export async function GET() {
  try {
    const categories = await getClinicalNoteCategories(DEFAULT_TENANT_ID)
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching clinical note categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const tenantId = data.tenantId || DEFAULT_TENANT_ID

    const newCategory = await createClinicalNoteCategory(
      {
        tenant_id: tenantId,
        name: data.name,
        description: data.description,
        color: data.color,
        icon: data.icon,
      },
      tenantId,
    )

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    console.error("Error creating clinical note category:", error)
    return NextResponse.json({ error: "Failed to create clinical note category" }, { status: 500 })
  }
}
