import { NextResponse } from "next/server"
import { getDbConnection } from "@/lib/db-connection"
import { createApiHandler } from "@/lib/error-handler"

interface HealthCheckResult {
  status: "healthy" | "degraded" | "unhealthy"
  timestamp: string
  checks: {
    database: {
      status: "pass" | "fail"
      responseTime?: number
      error?: string
    }
    redis?: {
      status: "pass" | "fail"
      responseTime?: number
      error?: string
    }
    auth?: {
      status: "pass" | "fail"
      error?: string
    }
  }
}

export const GET = createApiHandler(async () => {
  const result: HealthCheckResult = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    checks: {
      database: { status: "pass" },
    },
  }

  // Check database connection
  try {
    const start = Date.now()
    const sql = await getDbConnection()
    await sql`SELECT 1`
    result.checks.database.responseTime = Date.now() - start
  } catch (error) {
    result.checks.database.status = "fail"
    result.checks.database.error = error instanceof Error ? error.message : "Unknown error"
    result.status = "unhealthy"
  }

  // Check Redis connection if available
  if (process.env.REDIS_URL) {
    try {
      const { redis } = await import("@/lib/redis/client")
      const start = Date.now()
      await redis.ping()
      result.checks.redis = {
        status: "pass",
        responseTime: Date.now() - start,
      }
    } catch (error) {
      result.checks.redis = {
        status: "fail",
        error: error instanceof Error ? error.message : "Unknown error",
      }
      result.status = result.status === "unhealthy" ? "unhealthy" : "degraded"
    }
  }

  // Check auth configuration
  try {
    if (!process.env.NEXTAUTH_SECRET || !process.env.NEXTAUTH_URL) {
      throw new Error("Auth configuration missing")
    }
    result.checks.auth = { status: "pass" }
  } catch (error) {
    result.checks.auth = {
      status: "fail",
      error: error instanceof Error ? error.message : "Unknown error",
    }
    result.status = result.status === "unhealthy" ? "unhealthy" : "degraded"
  }

  return NextResponse.json(result, {
    status: result.status === "healthy" ? 200 : 503,
  })
})
