import { type NextRequest, NextResponse } from "next/server"
import { logError } from "@/lib/services/error-logging-service"
import { getSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    // Only allow authenticated users to log errors
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const errorData = await request.json()

    // Add request information
    errorData.url = request.url
    errorData.method = request.method

    const result = await logError(errorData)

    if (result.success) {
      return NextResponse.json({ success: true, errorId: result.errorId })
    } else {
      return NextResponse.json({ error: "Failed to log error" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in error logging API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
