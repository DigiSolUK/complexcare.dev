import { NextResponse } from "next/server"
import { getTasks, createTask } from "@/lib/services/task-service"
import { getCurrentUser } from "@/lib/auth-utils"
import { AppError } from "@/lib/error-handler"
import type { Task } from "@/lib/types"

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      throw new AppError("Unauthorized", 401)
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") as Task["status"] | null
    const assignedToId = searchParams.get("assignedToId")
    const patientId = searchParams.get("patientId") // Get patientId from query params

    const filters: {
      status?: Task["status"]
      assignedToId?: string
      patientId?: string
    } = {}

    if (status) filters.status = status
    if (assignedToId) filters.assignedToId = assignedToId
    if (patientId) filters.patientId = patientId // Apply patientId filter

    const tasks = await getTasks(user.tenantId, filters)
    return NextResponse.json({ success: true, data: tasks })
  } catch (error) {
    const appError = AppError.fromError(error)
    return NextResponse.json({ success: false, error: appError.message }, { status: appError.statusCode })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      throw new AppError("Unauthorized", 401)
    }

    const body = await request.json()
    const { title, description, dueDate, priority, status, assignedToId, patientId } = body // Include patientId

    if (!title || !priority || !status) {
      throw new AppError("Missing required fields: title, priority, status", 400)
    }

    const newTask = await createTask({
      tenant_id: user.tenantId,
      title,
      description,
      due_date: dueDate ? new Date(dueDate) : null,
      priority,
      status,
      assigned_to_id: assignedToId,
      patient_id: patientId, // Pass patientId to service
    })

    return NextResponse.json({ success: true, data: newTask }, { status: 201 })
  } catch (error) {
    const appError = AppError.fromError(error)
    return NextResponse.json({ success: false, error: appError.message }, { status: appError.statusCode })
  }
}
