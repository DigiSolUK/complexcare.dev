import { NextResponse } from "next/server"
import { getSqlClient, getDatabaseUrl } from "@/lib/db-connection-fix"

export async function GET() {
  try {
    const dbUrl = getDatabaseUrl()
    if (!dbUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "No database URL found in environment variables",
          checkedVars: [
            "DATABASE_URL",
            "POSTGRES_URL",
            "production_DATABASE_URL",
            "production_POSTGRES_URL",
            "AUTH_DATABASE_URL",
          ],
        },
        { status: 500 },
      )
    }

    const sql = getSqlClient()
    if (!sql) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to initialize SQL client",
        },
        { status: 500 },
      )
    }

    const result = await sql`SELECT NOW() as time`

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      time: result[0]?.time,
      databaseUrl: dbUrl.substring(0, 10) + "...", // Only show beginning for security
    })
  } catch (error) {
    console.error("Database test error:", error)

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
