import { neon } from "@neondatabase/serverless"
import { Dashboard } from "@/components/ai-analytics/dashboard"

interface AIAnalyticsData {
  totalAIInteractions: number
  aiInteractionsByType: { type: string; count: number }[]
  aiInteractionsByDate: { date: string; count: number }[]
  averageResponseTime: number
  successRate: number
}

export default async function AIAnalyticsPage({
  searchParams,
}: {
  searchParams: { tenantId?: string }
}) {
  const tenantId = searchParams.tenantId || process.env.DEFAULT_TENANT_ID

  if (!tenantId) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">AI Analytics Dashboard</h1>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <p className="text-yellow-700">
            No tenant ID provided. Please specify a tenant ID in the URL or set DEFAULT_TENANT_ID environment variable.
          </p>
        </div>
      </div>
    )
  }

  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Get total AI interactions
    const totalResult = await sql`
      SELECT COUNT(*) as count
      FROM ai_interactions
      WHERE tenant_id = ${tenantId}::uuid
    `
    const totalAIInteractions = Number.parseInt(totalResult[0].count)

    // Get AI interactions by type
    const byTypeResult = await sql`
      SELECT interaction_type as type, COUNT(*) as count
      FROM ai_interactions
      WHERE tenant_id = ${tenantId}::uuid
      GROUP BY interaction_type
      ORDER BY count DESC
    `
    const aiInteractionsByType = byTypeResult.map((row) => ({
      type: row.type,
      count: Number.parseInt(row.count),
    }))

    // Get AI interactions by date
    const byDateResult = await sql`
      SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as date, COUNT(*) as count
      FROM ai_interactions
      WHERE tenant_id = ${tenantId}::uuid
      GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD')
      ORDER BY date
    `
    const aiInteractionsByDate = byDateResult.map((row) => ({
      date: row.date,
      count: Number.parseInt(row.count),
    }))

    // Get average response time
    const avgTimeResult = await sql`
      SELECT AVG(response_time_ms) as avg_time
      FROM ai_interactions
      WHERE tenant_id = ${tenantId}::uuid
    `
    const averageResponseTime = Number.parseFloat(avgTimeResult[0].avg_time) || 0

    // Get success rate
    const successRateResult = await sql`
      SELECT 
        COUNT(CASE WHEN status = 'success' THEN 1 END) * 100.0 / COUNT(*) as success_rate
      FROM ai_interactions
      WHERE tenant_id = ${tenantId}::uuid
    `
    const successRate = Number.parseFloat(successRateResult[0].success_rate) || 0

    const analyticsData: AIAnalyticsData = {
      totalAIInteractions,
      aiInteractionsByType,
      aiInteractionsByDate,
      averageResponseTime,
      successRate,
    }

    return <Dashboard data={analyticsData} />
  } catch (error) {
    console.error("Error fetching AI analytics data:", error)
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">AI Analytics Dashboard</h1>
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">
            Error fetching AI analytics data. Please check the server logs for more information.
          </p>
        </div>
      </div>
    )
  }
}
