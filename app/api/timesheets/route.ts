import { type NextRequest, NextResponse } from "next/server"
import { getTimesheets, createTimesheet } from "@/lib/services/timesheet-service"
import { getCurrentUser } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId") || undefined
    const status = searchParams.get("status") || undefined

    const timesheets = await getTimesheets(user.tenant_id, {
      userId: userId as string | undefined,
      status: status as string | undefined,
    })

    return NextResponse.json(timesheets)
  } catch (error) {
    console.error("Error in GET /api/timesheets:", error)
    return NextResponse.json({ error: "Failed to fetch timesheets" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const timesheet = await createTimesheet(
      user.tenant_id,
      data.userId || user.id,
      data.date,
      data.startTime,
      data.endTime,
      data.breakDurationMinutes,
      data.notes,
    )

    return NextResponse.json(timesheet, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/timesheets:", error)
    return NextResponse.json({ error: "Failed to create timesheet" }, { status: 500 })
  }
}

