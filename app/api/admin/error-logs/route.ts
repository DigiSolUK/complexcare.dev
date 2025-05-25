import { type NextRequest, NextResponse } from "next/server"
import { getErrorLogs, type ErrorLogFilters } from "@/lib/services/error-logs-service"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    // Check if user is authenticated and has admin permissions
    if (!session?.user || !session.user.roles?.includes("admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams

    // Parse filters from query parameters
    const filters: ErrorLogFilters = {
      severity: (searchParams.get("severity") as any) || undefined,
      category: (searchParams.get("category") as any) || undefined,
      resolved: searchParams.has("resolved") ? searchParams.get("resolved") === "true" : undefined,
      search: searchParams.get("search") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      limit: searchParams.has("limit") ? Number.parseInt(searchParams.get("limit") as string) : 50,
      offset: searchParams.has("offset") ? Number.parseInt(searchParams.get("offset") as string) : 0,
    }

    const tenantId = session.user.tenantId
    const result = await getErrorLogs(tenantId, filters)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching error logs:", error)
    return NextResponse.json({ error: "Failed to fetch error logs" }, { status: 500 })
  }
}
