import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { testRedisConnection } from "@/lib/redis/client"
import { getBlobToken, getGroqApiKey, getDatabaseUrl, getRedisUrl } from "@/lib/env-safe"

export async function GET() {
  try {
    const healthStatus = await checkSystemHealth()

    return NextResponse.json(healthStatus)
  } catch (error) {
    console.error("Error checking system health:", error)
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
        status: "unhealthy",
        services: {
          database: { status: "unknown" },
          redis: { status: "unknown" },
          blob: { status: "unknown" },
          groq: { status: "unknown" },
        },
      },
      { status: 500 },
    )
  }
}

async function checkSystemHealth() {
  const results: Record<string, any> = {
    success: true,
    status: "healthy",
    services: {},
  }

  // Check database
  try {
    const dbResult = await sql.query("SELECT 1 as test")
    results.services.database = {
      status: "healthy",
      message: "Database connection successful",
      details: {
        url: maskConnectionString(getDatabaseUrl()),
      },
    }
  } catch (error) {
    results.success = false
    results.status = "degraded"
    results.services.database = {
      status: "unhealthy",
      message: (error as Error).message,
      details: {
        url: maskConnectionString(getDatabaseUrl()),
      },
    }
  }

  // Check Redis
  try {
    const redisConnected = await testRedisConnection()
    if (redisConnected) {
      results.services.redis = {
        status: "healthy",
        message: "Redis connection successful",
        details: {
          url: maskConnectionString(getRedisUrl()),
        },
      }
    } else {
      results.success = false
      results.status = "degraded"
      results.services.redis = {
        status: "unhealthy",
        message: "Redis connection failed",
        details: {
          url: maskConnectionString(getRedisUrl()),
        },
      }
    }
  } catch (error) {
    results.success = false
    results.status = "degraded"
    results.services.redis = {
      status: "unhealthy",
      message: (error as Error).message,
      details: {
        url: maskConnectionString(getRedisUrl()),
      },
    }
  }

  // Check Blob
  try {
    const blobToken = getBlobToken()
    results.services.blob = {
      status: blobToken ? "healthy" : "unhealthy",
      message: blobToken ? "Blob token found" : "Blob token missing",
      details: {
        tokenAvailable: !!blobToken,
      },
    }

    if (!blobToken) {
      results.success = false
      results.status = "degraded"
    }
  } catch (error) {
    results.success = false
    results.status = "degraded"
    results.services.blob = {
      status: "unhealthy",
      message: (error as Error).message,
    }
  }

  // Check Groq
  try {
    const groqApiKey = getGroqApiKey()
    results.services.groq = {
      status: groqApiKey ? "healthy" : "unhealthy",
      message: groqApiKey ? "Groq API key found" : "Groq API key missing",
      details: {
        keyAvailable: !!groqApiKey,
      },
    }

    if (!groqApiKey) {
      results.success = false
      results.status = "degraded"
    }
  } catch (error) {
    results.success = false
    results.status = "degraded"
    results.services.groq = {
      status: "unhealthy",
      message: (error as Error).message,
    }
  }

  // Overall status
  if (!results.success) {
    results.status = Object.values(results.services).every((service: any) => service.status === "unhealthy")
      ? "unhealthy"
      : "degraded"
  }

  return results
}

// Helper to mask sensitive connection strings
function maskConnectionString(connectionString: string): string {
  if (!connectionString) return "Not configured"

  try {
    const url = new URL(connectionString)

    // Mask password if present
    if (url.password) {
      url.password = "****"
    }

    // Return masked URL
    return url.toString()
  } catch {
    // If not a valid URL, just mask most of it
    return connectionString.substring(0, 8) + "..." + connectionString.substring(connectionString.length - 8)
  }
}
