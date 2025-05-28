import { NextResponse } from "next/server"
import { sql } from "@/lib/db-connection"

export async function GET() {
  try {
    // Try to execute a simple query to check database connection
    const result = await sql.query("SELECT version()")

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      version: result.rows?.[0]?.version || "Unknown",
    })
  } catch (error) {
    console.error("Database health check failed:", error)

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Database connection failed",
      },
      { status: 500 },
    )
  }
}
