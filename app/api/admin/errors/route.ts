import { type NextRequest, NextResponse } from "next/server"
import { getErrors } from "@/lib/services/error-logging-service"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    // Only allow admin users
    if (!session?.user || !session.user.roles?.includes("admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const resolved = searchParams.get("resolved")
    const severity = searchParams.get("severity")
    const limit = searchParams.get("limit")
    const offset = searchParams.get("offset")

    const result = await getErrors({
      resolved: resolved === "true" ? true : resolved === "false" ? false : undefined,
      severity: severity || undefined,
      limit: limit ? Number.parseInt(limit) : undefined,
      offset: offset ? Number.parseInt(offset) : undefined,
    })

    if (result.success) {
      return NextResponse.json({ errors: result.errors })
    } else {
      return NextResponse.json({ error: "Failed to fetch errors" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in admin errors API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
