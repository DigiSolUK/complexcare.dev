import { type NextRequest, NextResponse } from "next/server"
import { getTimesheet, updateTimesheet, deleteTimesheet } from "@/lib/services/timesheet-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const timesheet = await getTimesheet(params.id)

    if (!timesheet) {
      return NextResponse.json({ error: "Timesheet not found" }, { status: 404 })
    }

    return NextResponse.json(timesheet)
  } catch (error) {
    console.error(`Error in GET /api/timesheets/${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch timesheet" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const timesheet = await updateTimesheet(params.id, data)

    if (!timesheet) {
      return NextResponse.json({ error: "Timesheet not found or update failed" }, { status: 404 })
    }

    return NextResponse.json(timesheet)
  } catch (error) {
    console.error(`Error in PUT /api/timesheets/${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update timesheet" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await deleteTimesheet(params.id)

    if (!success) {
      return NextResponse.json({ error: "Timesheet not found or delete failed" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error in DELETE /api/timesheets/${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete timesheet" }, { status: 500 })
  }
}

