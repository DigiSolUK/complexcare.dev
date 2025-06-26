import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Define the response type
interface AIAnalyticsResponse {
  totalAIInteractions: number
  aiInteractionsByType: {
    type: string
    count: number
  }[]
  aiInteractionsByDate: {
    date: string
    count: number
  }[]
  averageResponseTime: number
  successRate: number
}

export async function GET(request: NextRequest) {
  try {
    // Get the tenant ID from the query parameter or header
    const searchParams = request.nextUrl.searchParams
    const tenantIdFromQuery = searchParams.get("tenantId")
    const tenantIdFromHeader = request.headers.get("x-tenant-id")
    let tenantId = tenantIdFromQuery || tenantIdFromHeader

    const DEFAULT_TENANT_ID = process.env.DEFAULT_TENANT_ID || "ba367cfe-6de0-4180-9566-1002b75cf82c" // Fallback to a known ID if env is not set

    // Check if tenant ID is provided, otherwise use default
    if (!tenantId) {
      tenantId = DEFAULT_TENANT_ID
    }

    // Connect to the database
    const sql = neon(process.env.DATABASE_URL!)

    // Query for total AI interactions
    const totalInteractionsResult = await sql`
      SELECT COUNT(*) as total
      FROM ai_interactions
      WHERE tenant_id = ${tenantId}
    `
    const totalAIInteractions = Number.parseInt(totalInteractionsResult[0]?.total || "0")

    // Query for AI interactions by type
    const interactionsByTypeResult = await sql`
      SELECT interaction_type as type, COUNT(*) as count
      FROM ai_interactions
      WHERE tenant_id = ${tenantId}
      GROUP BY interaction_type
      ORDER BY count DESC
    `

    // Query for AI interactions by date (last 30 days)
    const interactionsByDateResult = await sql`
      SELECT 
        DATE(created_at) as date, 
        COUNT(*) as count
      FROM ai_interactions
      WHERE 
        tenant_id = ${tenantId} AND
        created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `

    // Query for average response time
    const avgResponseTimeResult = await sql`
      SELECT AVG(response_time_ms) as avg_time
      FROM ai_interactions
      WHERE tenant_id = ${tenantId}
    `
    const averageResponseTime = Number.parseFloat(avgResponseTimeResult[0]?.avg_time || "0")

    // Query for success rate
    const successRateResult = await sql`
      SELECT 
        COUNT(CASE WHEN status = 'success' THEN 1 END) * 100.0 / COUNT(*) as success_rate
      FROM ai_interactions
      WHERE tenant_id = ${tenantId}
    `
    const successRate = Number.parseFloat(successRateResult[0]?.success_rate || "0")

    // Prepare the response
    const response: AIAnalyticsResponse = {
      totalAIInteractions,
      aiInteractionsByType: interactionsByTypeResult.map((row) => ({
        type: row.type,
        count: Number.parseInt(row.count),
      })),
      aiInteractionsByDate: interactionsByDateResult.map((row) => ({
        date: row.date,
        count: Number.parseInt(row.count),
      })),
      averageResponseTime,
      successRate,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching AI analytics:", error)
    return NextResponse.json({ error: "Failed to fetch AI analytics" }, { status: 500 })
  }
}
