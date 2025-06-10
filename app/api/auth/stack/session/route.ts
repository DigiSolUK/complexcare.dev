// app/api/auth/stack/session/route.ts
import { getSession } from "@auth0/nextjs-auth0"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession(req)

    if (!session) {
      return NextResponse.json({ user: null, isLoggedIn: false })
    }

    return NextResponse.json({
      user: session.user,
      isLoggedIn: true,
    })
  } catch (error) {
    console.error("Error getting session:", error)
    return NextResponse.json({ user: null, isLoggedIn: false })
  }
}
