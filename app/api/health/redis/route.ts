import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

export async function GET() {
  try {
    const redis = new Redis({
      url: process.env.KV_REST_API_URL || "",
      token: process.env.KV_REST_API_TOKEN || "",
    })

    // Set a test value
    const testKey = "health-check-test"
    const testValue = "ok-" + Date.now()

    await redis.set(testKey, testValue)
    const retrievedValue = await redis.get(testKey)

    // Clean up
    await redis.del(testKey)

    if (retrievedValue === testValue) {
      return NextResponse.json(
        {
          status: "healthy",
          message: "Redis connection successful",
          timestamp: new Date().toISOString(),
        },
        { status: 200 },
      )
    } else {
      return NextResponse.json(
        {
          status: "degraded",
          message: "Redis read/write test failed",
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Redis health check failed:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        message: "Redis connection failed",
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
