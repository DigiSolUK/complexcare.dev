import { type NextRequest, NextResponse } from "next/server"
import { DEFAULT_TENANT_ID } from "@/lib/constants"
import { getClinicalNoteCategories, createClinicalNoteCategory } from "@/lib/services/clinical-notes-service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenantId") || DEFAULT_TENANT_ID

    const categories = await getClinicalNoteCategories(tenantId)

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching clinical note categories:", error)
    return NextResponse.json({ error: "Failed to fetch clinical note categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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
