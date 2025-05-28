import { type NextRequest, NextResponse } from "next/server"
import { telemedicineService } from "@/lib/services/telemedicine-service"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { requirePermission } from "@/lib/auth/require-permission"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type")
    const userId = searchParams.get("userId")
    const tenantId = searchParams.get("tenantId") || undefined

    if (!type || !userId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    let sessions = []
    if (type === "patient") {
      await requirePermission("patient:read", session)
      sessions = await telemedicineService.getPatientUpcomingSessions(userId, tenantId)
    } else if (type === "care_professional") {
      await requirePermission("care_professional:read", session)
      sessions = await telemedicineService.getCareProUpcomingSessions(userId, tenantId)
    } else {
      return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 })
    }

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error("Error fetching telemedicine sessions:", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await requirePermission("telemedicine:create", session)

    const body = await request.json()
    const { appointmentId, patientId, careProfessionalId, scheduledStartTime, tenantId } = body

    if (!patientId || !careProfessionalId || !scheduledStartTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newSession = await telemedicineService.createSession(
      {
        appointment_id: appointmentId,
        patient_id: patientId,
        care_professional_id: careProfessionalId,
        scheduled_start_time: new Date(scheduledStartTime),
        status: "scheduled",
        tenant_id: tenantId,
      },
      tenantId,
    )

    return NextResponse.json({ session: newSession })
  } catch (error) {
    console.error("Error creating telemedicine session:", error)
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}
