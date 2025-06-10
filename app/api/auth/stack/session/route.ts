// app/api/auth/stack/session/route.ts
// This route can be called by the client to get the current session state
import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "@/lib/auth/stack-auth-server" // Correct import

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(req)

    if (session && session.user && !session.error) {
      return NextResponse.json({ isAuthenticated: true, user: session.user, tenantId: session.tenantId })
    } else {
      return NextResponse.json({ isAuthenticated: false, user: null, error: session?.error })
    }
  } catch (error) {
    console.error("Stack Session API error:", error)
    return NextResponse.json({ isAuthenticated: false, user: null, error: "Internal server error" }, { status: 500 })
  }
}
