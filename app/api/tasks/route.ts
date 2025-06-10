import { NextResponse } from "next/server"
import { TaskService } from "@/lib/services/task-service"
import { getCurrentUser } from "@/lib/auth-utils"
import { z } from "zod"
import type { Task } from "@/lib/types"

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["pending", "in_progress", "completed", "overdue"]),
  assignedToId: z.string().optional().nullable(),
  patientId: z.string().optional().nullable(), // New: patientId
})

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") as Task["status"] | undefined
    const assignedToId = searchParams.get("assignedToId") || undefined
    const patientId = searchParams.get("patientId") || undefined // New: patientId filter

    const taskService = await TaskService.create()
    const tasks = await taskService.getTasks({ status, assignedToId, patientId })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Failed to fetch tasks:", error)
    return NextResponse.json({ message: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = taskSchema.parse(body)

    const taskService = await TaskService.create()
    const newTask = await taskService.createTask({
      ...validatedData,
      dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
    })

    return NextResponse.json(newTask, { status: 201 })
  } catch (error: any) {
    console.error("Failed to create task:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ message: "Failed to create task" }, { status: 500 })
  }
}
