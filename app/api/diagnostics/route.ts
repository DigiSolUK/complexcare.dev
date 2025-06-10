import { NextResponse } from "next/server"
import { runDiagnostics } from "@/lib/diagnostics"

export async function GET() {
  try {
    const diagnosticResults = await runDiagnostics()

    return NextResponse.json(diagnosticResults)
  } catch (error) {
    console.error("Diagnostics error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
