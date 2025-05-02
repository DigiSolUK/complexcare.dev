import { type NextRequest, NextResponse } from "next/server"
import clinicalNotesService from "@/lib/services/clinical-notes-service"
import { getCurrentTenant } from "@/lib/tenant-utils"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenant = await getCurrentTenant()
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    const templates = await clinicalNotesService.getTemplates(tenant.id)

    return NextResponse.json(templates)
  } catch (error) {
    console.error("Error fetching clinical note templates:", error)
    return NextResponse.json({ error: "Failed to fetch clinical note templates" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenant = await getCurrentTenant()
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    const data = await request.json()
    const userId = session.user.id

    const template = await clinicalNotesService.createTemplate(tenant.id, userId, data)

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error("Error creating clinical note template:", error)
    return NextResponse.json({ error: "Failed to create clinical note template" }, { status: 500 })
  }
}
