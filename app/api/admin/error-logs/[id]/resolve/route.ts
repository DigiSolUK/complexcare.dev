import { type NextRequest, NextResponse } from "next/server"
import { resolveErrorLog } from "@/lib/services/error-logs-service"
import { getSession } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    // Check if user is authenticated and has admin permissions
    if (!session?.user || !session.user.roles?.includes("admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const tenantId = session.user.tenantId
    const userId = session.user.id

    const success = await resolveErrorLog(id, userId, tenantId)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to resolve error log" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error resolving error log:", error)
    return NextResponse.json({ error: "Failed to resolve error log" }, { status: 500 })
  }
}
