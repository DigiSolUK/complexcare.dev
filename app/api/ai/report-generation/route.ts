import { type NextRequest, NextResponse } from "next/server"
import { generateReport } from "@/lib/ai/groq-client"

export async function POST(request: NextRequest) {
  try {
    const { data, reportType } = await request.json()

    if (!data) {
      return NextResponse.json({ error: "Report data is required" }, { status: 400 })
    }

    const result = await generateReport(data, reportType || "general")

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in report generation API:", error)
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 })
  }
}
