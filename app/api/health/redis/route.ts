import { NextResponse } from "next/server"
import { testRedisConnection } from "@/lib/redis/client"

export async function GET() {
  try {
    const isConnected = await testRedisConnection()

    if (isConnected) {
      return NextResponse.json({
        status: "ok",
        message: "Redis connection successful",
      })
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: "Redis connection failed",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Redis health check failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Redis health check failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
