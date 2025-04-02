import { type NextRequest, NextResponse } from "next/server"
import {
  getTimesheet,
  updateTimesheet,
  deleteTimesheet,
  approveTimesheet,
  rejectTimesheet,
} from "@/lib/services/timesheet-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenantId")

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const { timesheet, error } = await getTimesheet(tenantId, id)
    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    if (!timesheet) {
      return NextResponse.json({ error: "Timesheet not found" }, { status: 404 })
    }

    return NextResponse.json({ timesheet })
  } catch (error) {
    console.error("Error in timesheet API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { tenantId, ...timesheetData } = body

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const { timesheet, error } = await updateTimesheet(tenantId, id, timesheetData)
    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ timesheet })
  } catch (error) {
    console.error("Error in timesheet API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenantId")

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const { success, error } = await deleteTimesheet(tenantId, id)
    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ success })
  } catch (error) {
    console.error("Error in timesheet API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { tenantId, action, approverId, notes } = body

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    if (!approverId) {
      return NextResponse.json({ error: "Approver ID is required" }, { status: 400 })
    }

    let result
    if (action === "approve") {
      result = await approveTimesheet(tenantId, id, approverId)
    } else if (action === "reject") {
      if (!notes) {
        return NextResponse.json({ error: "Notes are required for rejection" }, { status: 400 })
      }
      result = await rejectTimesheet(tenantId, id, approverId, notes)
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ timesheet: result.timesheet })
  } catch (error) {
    console.error("Error in timesheet API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

