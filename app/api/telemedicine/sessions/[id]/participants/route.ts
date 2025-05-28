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

    const participants = await telemedicineService.getSessionParticipants(sessionId, tenantId)

    return NextResponse.json({ participants })
  } catch (error) {
    console.error("Error fetching session participants:", error)
    return NextResponse.json({ error: "Failed to fetch participants" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await requirePermission("telemedicine:update", session)

    const sessionId = params.id
    const body = await request.json()
    const { userId, userType, deviceInfo, tenantId } = body

    if (!userId || !userType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const participant = await telemedicineService.recordParticipantJoin(
      sessionId,
      userId,
      userType,
      deviceInfo || {},
      tenantId,
    )

    return NextResponse.json({ participant })
  } catch (error) {
    console.error("Error recording participant join:", error)
    return NextResponse.json({ error: "Failed to record participant join" }, { status: 500 })
  }
}
