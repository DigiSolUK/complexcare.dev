import { type NextRequest, NextResponse } from "next/server"
import { telemedicineService } from "@/lib/services/telemedicine-service"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { requirePermission } from "@/lib/auth/require-permission"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await requirePermission("telemedicine:read", session)

    const sessionId = params.id
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenantId") || undefined

    const telemedicineSession = await telemedicineService.getSessionById(sessionId, tenantId)
    if (!telemedicineSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    return NextResponse.json({ session: telemedicineSession })
  } catch (error) {
    console.error("Error fetching telemedicine session:", error)
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await requirePermission("telemedicine:update", session)

    const sessionId = params.id
    const body = await request.json()
    const { status, notes, tenantId } = body

    let updatedSession = null

    if (status === "in_progress") {
      updatedSession = await telemedicineService.startSession(sessionId, tenantId)
    } else if (status === "completed") {
      updatedSession = await telemedicineService.endSession(sessionId, notes, tenantId)
    } else {
      updatedSession = await telemedicineService.updateSessionStatus(sessionId, status, tenantId)
    }

    if (!updatedSession) {
      return NextResponse.json({ error: "Session not found or could not be updated" }, { status: 404 })
    }

    return NextResponse.json({ session: updatedSession })
  } catch (error) {
    console.error("Error updating telemedicine session:", error)
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 })
  }
}
