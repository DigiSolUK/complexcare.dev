import { type NextRequest, NextResponse } from "next/server"
import { getErrorStats } from "@/lib/services/error-logs-service"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    // Check if user is authenticated and has admin permissions
    if (!session?.user || !session.user.roles?.includes("admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = session.user.tenantId
    const stats = await getErrorStats(tenantId)

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching error stats:", error)
    return NextResponse.json({ error: "Failed to fetch error stats" }, { status: 500 })
  }
}
