import { type NextRequest, NextResponse } from "next/server"
import { summarizeDocument } from "@/lib/ai/groq-client"

export async function POST(request: NextRequest) {
  try {
    const { document } = await request.json()

    if (!document) {
      return NextResponse.json({ error: "Document content is required" }, { status: 400 })
    }

    const result = await summarizeDocument(document)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in document summary API:", error)
    return NextResponse.json({ error: "Failed to summarize document" }, { status: 500 })
  }
}
