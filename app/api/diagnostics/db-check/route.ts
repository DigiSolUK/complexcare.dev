import { NextResponse } from "next/server"
import { testDatabaseConnectionInApp } from "@/lib/db"

// Explicitly force the Node.js runtime for consistent behavior
export const runtime = "nodejs"

export async function GET() {
  console.log("Attempting database connection test from within /api/diagnostics/db-check...")
  const result = await testDatabaseConnectionInApp()

  if (result.connected) {
    console.log("DB check successful:", result)
    return NextResponse.json({
      status: "Success",
      ...result,
    })
  } else {
    console.error("DB check failed:", result)
    return NextResponse.json(
      {
        status: "Failure",
        ...result,
      },
      { status: 500 },
    )
  }
}
