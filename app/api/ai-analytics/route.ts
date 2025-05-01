import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth0-adapter"

export async function GET(request: NextRequest) {
  try {
    // Get the tenant ID from the query parameter or header
    const searchParams = request.nextUrl.searchParams
    const tenantIdFromQuery = searchParams.get("tenantId")
    const tenantIdFromHeader = request.headers.get("x-tenant-id")
    const tenantId = tenantIdFromQuery || tenantIdFromHeader

    // Check if tenant ID is provided
    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    // Get the user session for authentication
    const session = await getSession()

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Mock data for AI analytics
    return NextResponse.json({
      totalAIInteractions: 120,
      aiInteractionsByType: [
        { type: "summarization", count: 45 },
        { type: "generation", count: 35 },
        { type: "classification", count: 25 },
        { type: "extraction", count: 15 },
      ],
      aiInteractionsByDate: [
        { date: "2023-05-01", count: 10 },
        { date: "2023-05-02", count: 15 },
        { date: "2023-05-03", count: 8 },
        { date: "2023-05-04", count: 12 },
      ],
      averageResponseTime: 450.75,
      successRate: 98.5,
    })
  } catch (error) {
    console.error("Error fetching AI analytics:", error)
    return NextResponse.json({ error: "Failed to fetch AI analytics" }, { status: 500 })
  }
}
