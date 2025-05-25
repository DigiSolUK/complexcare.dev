import { NextResponse } from "next/server"
import { sql } from "@/lib/db-manager"

export async function GET() {
  try {
    // Simple query to check database connection
    const result = await sql.query("SELECT 1 as health_check")

    if (result.rows && result.rows.length > 0) {
      return NextResponse.json({ status: "healthy", message: "Database connection successful" })
    } else {
      return NextResponse.json({ status: "unhealthy", message: "Database query returned no results" }, { status: 500 })
    }
  } catch (error) {
    console.error("Database health check failed:", error)
    return NextResponse.json(
      { status: "unhealthy", message: "Database connection failed", error: String(error) },
      { status: 500 },
    )
  }
}
