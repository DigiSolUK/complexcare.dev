// app/api/auth/stack/session/route.ts
import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "@/lib/auth/stack-auth-server"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(req)

    if (session && session.user && !session.error) {
      return NextResponse.json({
        isAuthenticated: true,
        user: session.user,
        tenantId: session.tenantId,
      })
    } else {
      return NextResponse.json({
        isAuthenticated: false,
        user: null,
        error: session?.error,
      })
    }
  } catch (error) {
    console.error("Session API error:", error)
    return NextResponse.json({ isAuthenticated: false, user: null, error: "Internal server error" }, { status: 500 })
  }
}
