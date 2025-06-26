import { type NextRequest, NextResponse } from "next/server"
import { markErrorAsResolved } from "@/lib/services/error-logging-service"
import { getSession } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    // Only allow admin users
    if (!session?.user || !session.user.roles?.includes("admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { notes } = await request.json()
    const errorId = params.id

    const result = await markErrorAsResolved(errorId, notes)

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to resolve error" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in resolve error API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
