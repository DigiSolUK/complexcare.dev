import { type NextRequest, NextResponse } from "next/server"
import { approveTimesheet } from "@/lib/services/timesheet-service"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const { approverName } = data

    if (!approverName) {
      return NextResponse.json({ error: "Approver name is required" }, { status: 400 })
    }

    const timesheet = await approveTimesheet(params.id, approverName)

    if (!timesheet) {
      return NextResponse.json({ error: "Timesheet not found or approval failed" }, { status: 404 })
    }

    return NextResponse.json(timesheet)
  } catch (error) {
    console.error(`Error in POST /api/timesheets/${params.id}/approve:`, error)
    return NextResponse.json({ error: "Failed to approve timesheet" }, { status: 500 })
  }
}

