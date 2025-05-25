import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    // Simple query to check database connection
    const result = await db.query("SELECT NOW() as time")

    return NextResponse.json({
      status: "ok",
      message: "Database connection successful",
      timestamp: result[0].time,
    })
  } catch (error) {
    console.error("Database health check failed:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
