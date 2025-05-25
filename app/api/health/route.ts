import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getPerformanceMetrics } from "@/lib/monitoring/performance"
import { getCacheStats } from "@/lib/cache/cache"

export async function GET() {
  try {
    // Check database connection using the correct tagged template syntax
    const sql = neon(process.env.DATABASE_URL)
    const dbStartTime = performance.now()
    const dbResult = await sql`SELECT NOW() as time`
    const dbEndTime = performance.now()
    const dbResponseTime = dbEndTime - dbStartTime

    // Get performance metrics
    const performanceMetrics = getPerformanceMetrics()

    // Get cache stats
    const cacheStats = getCacheStats()

    // Get memory usage
    const memoryUsage = process.memoryUsage()

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        responseTime: dbResponseTime,
        serverTime: dbResult[0].time,
      },
      performance: performanceMetrics,
      cache: cacheStats,
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024) + " MB",
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + " MB",
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + " MB",
        external: Math.round(memoryUsage.external / 1024 / 1024) + " MB",
      },
      uptime: Math.round(process.uptime()) + " seconds",
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
