import { type NextRequest, NextResponse } from "next/server"
import { enhancedTaskService } from "@/lib/services/enhanced-task-service"
import { DEFAULT_TENANT_ID } from "@/lib/constants"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { logError } from "@/lib/services/error-logging-service"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = request.headers.get("x-tenant-id") || DEFAULT_TENANT_ID
    const taskId = params.id

    const task = await enhancedTaskService.updateTaskStatus(taskId, "completed", tenantId)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error: any) {
    console.error(`Error in POST /api/tasks/${params.id}/complete:`, error)
    await logError({
      message: `Error in POST /api/tasks/${params.id}/complete: ${error.message}`,
      stack: error.stack,
      componentPath: "app/api/tasks/[id]/complete/route.ts:POST",
      severity: "high",
    })

    return NextResponse.json({ error: "Failed to complete task" }, { status: 500 })
  }
}
