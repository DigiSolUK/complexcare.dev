import { type NextRequest, NextResponse } from "next/server"
import { enhancedTaskService } from "@/lib/services/enhanced-task-service"
import { DEFAULT_TENANT_ID } from "@/lib/constants"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { logError } from "@/lib/services/error-logging-service"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tenantId = request.headers.get("x-tenant-id") || DEFAULT_TENANT_ID

    // Parse query parameters
    const status = searchParams.get("status")?.split(",") as any
    const priority = searchParams.get("priority")?.split(",") as any
    const assigned_to = searchParams.get("assigned_to")
    const patient_id = searchParams.get("patient_id")
    const care_professional_id = searchParams.get("care_professional_id")
    const category = searchParams.get("category")
    const due_date_start = searchParams.get("due_date_start")
      ? new Date(searchParams.get("due_date_start")!)
      : undefined
    const due_date_end = searchParams.get("due_date_end") ? new Date(searchParams.get("due_date_end")!) : undefined
    const search = searchParams.get("search") || undefined
    const tags = searchParams.get("tags")?.split(",") || undefined

    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "20", 10)
    const sortBy = searchParams.get("sortBy") || "due_date"
    const sortOrder = (searchParams.get("sortOrder") || "asc") as "asc" | "desc"

    // Build filter object
    const filters: any = {}

    if (status) filters.status = status
    if (priority) filters.priority = priority
    if (assigned_to) filters.assigned_to = assigned_to
    if (patient_id) filters.patient_id = patient_id
    if (care_professional_id) filters.care_professional_id = care_professional_id
    if (category) filters.category = category
    if (due_date_start) filters.due_date_start = due_date_start
    if (due_date_end) filters.due_date_end = due_date_end
    if (search) filters.search = search
    if (tags) filters.tags = tags

    // Get tasks with filters
    const { tasks, total } = await enhancedTaskService.getTasks(filters, sortBy, sortOrder, page, pageSize, tenantId)

    // Get task statistics
    const statistics = await enhancedTaskService.getTaskStatistics(tenantId)

    // Get task categories
    const categories = await enhancedTaskService.getTaskCategories(tenantId)

    return NextResponse.json({
      tasks,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      statistics,
      categories,
    })
  } catch (error: any) {
    console.error("Error in GET /api/tasks:", error)
    await logError({
      message: `Error in GET /api/tasks: ${error.message}`,
      stack: error.stack,
      componentPath: "app/api/tasks/route.ts:GET",
      severity: "high",
    })

    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = request.headers.get("x-tenant-id") || DEFAULT_TENANT_ID
    const data = await request.json()

    // Create task
    const task = await enhancedTaskService.createTask(
      {
        ...data,
        assigned_to: data.assigned_to || session.user.id,
        assigned_by: session.user.id,
      },
      tenantId,
    )

    return NextResponse.json(task, { status: 201 })
  } catch (error: any) {
    console.error("Error in POST /api/tasks:", error)
    await logError({
      message: `Error in POST /api/tasks: ${error.message}`,
      stack: error.stack,
      componentPath: "app/api/tasks/route.ts:POST",
      severity: "high",
    })

    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
