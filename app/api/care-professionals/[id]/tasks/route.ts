import { type NextRequest, NextResponse } from "next/server"
import { getTasksForCareProfessional } from "@/lib/services/task-service"
import { getCurrentUser } from "@/lib/auth-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = user.tenant_id
    const tasks = await getTasksForCareProfessional(tenantId, params.id)

    return NextResponse.json(tasks)
  } catch (error) {
    console.error(`Error in GET /api/care-professionals/${params.id}/tasks:`, error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

