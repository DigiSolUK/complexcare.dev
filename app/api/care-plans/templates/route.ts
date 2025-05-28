import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { CarePlanTemplateService } from "@/lib/services/care-plan-template-service"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const templates = await CarePlanTemplateService.getTemplates(session.user.tenantId)
    return NextResponse.json(templates)
  } catch (error) {
    console.error("Error fetching care plan templates:", error)
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const template = await CarePlanTemplateService.createTemplate(data, session.user.id, session.user.tenantId)

    return NextResponse.json(template)
  } catch (error) {
    console.error("Error creating care plan template:", error)
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 })
  }
}
