import { type NextRequest, NextResponse } from "next/server"
import { enhancedTaskService } from "@/lib/services/enhanced-task-service"
import { DEFAULT_TENANT_ID } from "@/lib/constants"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { logError } from "@/lib/services/error-logging-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = request.headers.get("x-tenant-id") || DEFAULT_TENANT_ID
    const taskId = params.id

    const task = await enhancedTaskService.getTaskById(taskId, tenantId)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error: any) {
    console.error(`Error in GET /api/tasks/${params.id}:`, error)
    await logError({
      message: `Error in GET /api/tasks/${params.id}: ${error.message}`,
      stack: error.stack,
      componentPath: "app/api/tasks/[id]/route.ts:GET",
      severity: "high",
    })

    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = request.headers.get("x-tenant-id") || DEFAULT_TENANT_ID
    const taskId = params.id
    const data = await request.json()

    const task = await enhancedTaskService.updateTask(taskId, data, tenantId)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error: any) {
    console.error(`Error in PATCH /api/tasks/${params.id}:`, error)
    await logError({
      message: `Error in PATCH /api/tasks/${params.id}: ${error.message}`,
      stack: error.stack,
      componentPath: "app/api/tasks/[id]/route.ts:PATCH",
      severity: "high",
    })

    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = request.headers.get("x-tenant-id") || DEFAULT_TENANT_ID
    const taskId = params.id

    const success = await enhancedTaskService.deleteTask(taskId, tenantId)

    if (!success) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(`Error in DELETE /api/tasks/${params.id}:`, error)
    await logError({
      message: `Error in DELETE /api/tasks/${params.id}: ${error.message}`,
      stack: error.stack,
      componentPath: "app/api/tasks/[id]/route.ts:DELETE",
      severity: "high",
    })

    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}
