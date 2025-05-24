import { type NextRequest, NextResponse } from "next/server"
import { getClinicalNoteTemplates, createClinicalNoteTemplate } from "@/lib/services/clinical-notes-service"
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
    const categoryId = searchParams.get("categoryId")

    const templates = await getClinicalNoteTemplates(tenantId)

    // Filter by category if specified
    const filteredTemplates = categoryId
      ? templates.filter((template) => template.category_id === categoryId)
      : templates

    return NextResponse.json(filteredTemplates)
  } catch (error) {
    console.error("Error in GET /api/clinical-notes/templates:", error)
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
    if (!data.name || !data.content) {
      return NextResponse.json({ error: "Template name and content are required" }, { status: 400 })
    }

    // Set created_by from session if not provided
    if (!data.created_by) {
      data.created_by = session.user?.id || session.user?.email
    }

    const template = await createClinicalNoteTemplate(data, tenantId)

    if (!template) {
      return NextResponse.json({ error: "Failed to create template" }, { status: 500 })
    }

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/clinical-notes/templates:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
