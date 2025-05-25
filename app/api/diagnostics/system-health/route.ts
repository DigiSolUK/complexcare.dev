import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { redis } from "@/lib/redis/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { put } from "@vercel/blob"

interface HealthCheckResult {
  service: string
  status: "healthy" | "unhealthy" | "degraded"
  message: string
  details?: any
  error?: string
}

export async function GET() {
  const results: HealthCheckResult[] = []

  // 1. Check Database Connection
  try {
    const databaseUrl = process.env.production_DATABASE_URL || process.env.DATABASE_URL
    if (!databaseUrl) {
      results.push({
        service: "Database",
        status: "unhealthy",
        message: "No database URL configured",
        error: "Missing DATABASE_URL environment variable",
      })
    } else {
      const sql = neon(databaseUrl)
      const startTime = Date.now()
      const result = await sql`SELECT NOW() as time, current_database() as database`
      const responseTime = Date.now() - startTime

      results.push({
        service: "Database",
        status: "healthy",
        message: "Database connection successful",
        details: {
          responseTime: `${responseTime}ms`,
          database: result[0].database,
          serverTime: result[0].time,
        },
      })
    }
  } catch (error) {
    results.push({
      service: "Database",
      status: "unhealthy",
      message: "Database connection failed",
      error: error instanceof Error ? error.message : String(error),
    })
  }

  // 2. Check Redis Connection
  try {
    const startTime = Date.now()
    await redis.set("health-check", new Date().toISOString(), { ex: 60 })
    const value = await redis.get("health-check")
    const responseTime = Date.now() - startTime

    if (value) {
      results.push({
        service: "Redis",
        status: "healthy",
        message: "Redis connection successful",
        details: {
          responseTime: `${responseTime}ms`,
          testValue: value,
        },
      })
    } else {
      results.push({
        service: "Redis",
        status: "degraded",
        message: "Redis connected but test failed",
        details: {
          responseTime: `${responseTime}ms`,
        },
      })
    }
  } catch (error) {
    results.push({
      service: "Redis",
      status: "unhealthy",
      message: "Redis connection failed",
      error: error instanceof Error ? error.message : String(error),
    })
  }

  // 3. Check Authentication
  try {
    const session = await getServerSession(authOptions)
    if (authOptions) {
      results.push({
        service: "Authentication",
        status: session ? "healthy" : "degraded",
        message: session ? "Authentication system operational" : "No active session",
        details: {
          hasSession: !!session,
          authConfigured: true,
        },
      })
    } else {
      results.push({
        service: "Authentication",
        status: "unhealthy",
        message: "Authentication not configured",
        error: "authOptions is undefined",
      })
    }
  } catch (error) {
    results.push({
      service: "Authentication",
      status: "unhealthy",
      message: "Authentication check failed",
      error: error instanceof Error ? error.message : String(error),
    })
  }

  // 4. Check Blob Storage
  try {
    const testBlob = new Blob(["health-check"], { type: "text/plain" })
    const { url } = await put("health-check.txt", testBlob, {
      access: "public",
      addRandomSuffix: true,
    })

    results.push({
      service: "Blob Storage",
      status: "healthy",
      message: "Blob storage operational",
      details: {
        testUrl: url,
      },
    })
  } catch (error) {
    results.push({
      service: "Blob Storage",
      status: "unhealthy",
      message: "Blob storage check failed",
      error: error instanceof Error ? error.message : String(error),
    })
  }

  // 5. Check Environment Variables
  const requiredEnvVars = [
    "DATABASE_URL",
    "NEXTAUTH_URL",
    "NEXTAUTH_SECRET",
    "KV_URL",
    "KV_REST_API_TOKEN",
    "BLOB_READ_WRITE_TOKEN",
    "GROQ_API_KEY",
  ]

  const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName])

  results.push({
    service: "Environment Variables",
    status: missingEnvVars.length === 0 ? "healthy" : "unhealthy",
    message:
      missingEnvVars.length === 0 ? "All required environment variables present" : "Missing environment variables",
    details: {
      missing: missingEnvVars,
      total: requiredEnvVars.length,
      configured: requiredEnvVars.length - missingEnvVars.length,
    },
  })

  // 6. Check Groq AI
  try {
    if (process.env.GROQ_API_KEY) {
      results.push({
        service: "Groq AI",
        status: "healthy",
        message: "Groq API key configured",
        details: {
          keyPresent: true,
        },
      })
    } else {
      results.push({
        service: "Groq AI",
        status: "unhealthy",
        message: "Groq API key not configured",
        error: "Missing GROQ_API_KEY",
      })
    }
  } catch (error) {
    results.push({
      service: "Groq AI",
      status: "unhealthy",
      message: "Groq AI check failed",
      error: error instanceof Error ? error.message : String(error),
    })
  }

  // Calculate overall health
  const unhealthyCount = results.filter((r) => r.status === "unhealthy").length
  const degradedCount = results.filter((r) => r.status === "degraded").length
  const overallStatus = unhealthyCount > 0 ? "unhealthy" : degradedCount > 0 ? "degraded" : "healthy"

  return NextResponse.json({
    status: overallStatus,
    timestamp: new Date().toISOString(),
    services: results,
    summary: {
      total: results.length,
      healthy: results.filter((r) => r.status === "healthy").length,
      degraded: degradedCount,
      unhealthy: unhealthyCount,
    },
  })
}
