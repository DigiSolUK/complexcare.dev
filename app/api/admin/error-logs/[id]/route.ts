import { type NextRequest, NextResponse } from "next/server"
import { getErrorLogById } from "@/lib/services/error-logs-service"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    // Check if user is authenticated and has admin permissions
    if (!session?.user || !session.user.roles?.includes("admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const tenantId = session.user.tenantId

    const errorLog = await getErrorLogById(id, tenantId)

    if (errorLog) {
      return NextResponse.json(errorLog)
    } else {
      return NextResponse.json({ error: "Error log not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error fetching error log:", error)
    return NextResponse.json({ error: "Failed to fetch error log" }, { status: 500 })
  }
}
