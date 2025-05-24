import { type NextRequest, NextResponse } from "next/server"
import { getClinicalNoteCategories, createClinicalNoteCategory } from "@/lib/services/clinical-notes-service"
import { DEFAULT_TENANT_ID } from "@/lib/constants"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenantId") || DEFAULT_TENANT_ID

    const categories = await getClinicalNoteCategories(tenantId)
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error in GET /api/clinical-notes/categories:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const tenantId = data.tenant_id || DEFAULT_TENANT_ID

    // Validate required fields
    if (!data.name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    const category = await createClinicalNoteCategory(data, tenantId)

    if (!category) {
      return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
    }

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/clinical-notes/categories:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
