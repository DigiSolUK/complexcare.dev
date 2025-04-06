import { type NextRequest, NextResponse } from "next/server"
import { rejectTimesheet } from "@/lib/services/timesheet-service"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const { approverName, reason } = data

    if (!approverName) {
      return NextResponse.json({ error: "Approver name is required" }, { status: 400 })
    }

    if (!reason) {
      return NextResponse.json({ error: "Rejection reason is required" }, { status: 400 })
    }

    const timesheet = await rejectTimesheet(params.id, approverName, reason)

    if (!timesheet) {
      return NextResponse.json({ error: "Timesheet not found or rejection failed" }, { status: 404 })
    }

    return NextResponse.json(timesheet)
  } catch (error) {
    console.error(`Error in POST /api/timesheets/${params.id}/reject:`, error)
    return NextResponse.json({ error: "Failed to reject timesheet" }, { status: 500 })
  }
}

