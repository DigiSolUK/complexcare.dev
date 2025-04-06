import { type NextRequest, NextResponse } from "next/server"
import { getTimesheets, createTimesheet } from "@/lib/services/timesheet-service"

export async function GET(request: NextRequest) {
  try {
    const timesheets = await getTimesheets()
    return NextResponse.json(timesheets)
  } catch (error) {
    console.error("Error in GET /api/timesheets:", error)
    return NextResponse.json({ error: "Failed to fetch timesheets" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const timesheet = await createTimesheet(data)

    if (!timesheet) {
      return NextResponse.json({ error: "Failed to create timesheet" }, { status: 400 })
    }

    return NextResponse.json(timesheet, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/timesheets:", error)
    return NextResponse.json({ error: "Failed to create timesheet" }, { status: 500 })
  }
}

