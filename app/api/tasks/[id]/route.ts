import { NextResponse } from "next/server"
import { TaskService } from "@/lib/services/task-service"
import { getCurrentUser } from "@/lib/auth-utils"
import { z } from "zod"

const taskUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["pending", "in_progress", "completed", "overdue"]).optional(),
  assignedToId: z.string().optional().nullable(),
  patientId: z.string().optional().nullable(), // New: patientId
})

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const taskService = await TaskService.create()
    const task = await taskService.getTaskById(params.id)

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error("Failed to fetch task:", error)
    return NextResponse.json({ message: "Failed to fetch task" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = taskUpdateSchema.parse(body)

    const taskService = await TaskService.create()
    const updatedTask = await taskService.updateTask(params.id, {
      ...validatedData,
      dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
    })

    if (!updatedTask) {
      return NextResponse.json({ message: "Task not found or update failed" }, { status: 404 })
    }

    return NextResponse.json(updatedTask)
  } catch (error: any) {
    console.error("Failed to update task:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ message: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const taskService = await TaskService.create()
    const success = await taskService.deleteTask(params.id)

    if (!success) {
      return NextResponse.json({ message: "Task not found or deletion failed" }, { status: 404 })
    }

    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Failed to delete task:", error)
    return NextResponse.json({ message: "Failed to delete task" }, { status: 500 })
  }
}
