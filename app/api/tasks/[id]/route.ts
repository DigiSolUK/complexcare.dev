import { NextResponse } from "next/server"
import { getTaskById, updateTask, deleteTask } from "@/lib/services/task-service"
import { getCurrentUser } from "@/lib/auth-utils"
import { AppError } from "@/lib/error-handler"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      throw new AppError("Unauthorized", 401)
    }

    const { id } = params
    const task = await getTaskById(id)

    if (!task || task.tenantId !== user.tenantId) {
      throw new AppError("Task not found or unauthorized access", 404)
    }

    return NextResponse.json({ success: true, data: task })
  } catch (error) {
    const appError = AppError.fromError(error)
    return NextResponse.json({ success: false, error: appError.message }, { status: appError.statusCode })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      throw new AppError("Unauthorized", 401)
    }

    const { id } = params
    const body = await request.json()
    const { title, description, dueDate, priority, status, assignedToId, patientId } = body // Include patientId

    const updatedTask = await updateTask(id, {
      title,
      description,
      due_date: dueDate ? new Date(dueDate) : null,
      priority,
      status,
      assigned_to_id: assignedToId,
      patient_id: patientId, // Pass patientId to service
    })

    if (!updatedTask || updatedTask.tenantId !== user.tenantId) {
      throw new AppError("Task not found or unauthorized to update", 404)
    }

    return NextResponse.json({ success: true, data: updatedTask })
  } catch (error) {
    const appError = AppError.fromError(error)
    return NextResponse.json({ success: false, error: appError.message }, { status: appError.statusCode })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      throw new AppError("Unauthorized", 401)
    }

    const { id } = params
    const task = await getTaskById(id) // Check ownership before deleting

    if (!task || task.tenantId !== user.tenantId) {
      throw new AppError("Task not found or unauthorized to delete", 404)
    }

    const success = await deleteTask(id)

    if (!success) {
      throw new AppError("Failed to delete task", 500)
    }

    return NextResponse.json({ success: true, message: "Task deleted successfully" })
  } catch (error) {
    const appError = AppError.fromError(error)
    return NextResponse.json({ success: false, error: appError.message }, { status: appError.statusCode })
  }
}
