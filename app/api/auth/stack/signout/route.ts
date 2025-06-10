// app/api/auth/stack/signout/route.ts
import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies()
    cookieStore.delete("auth_session_token")

    return NextResponse.json({ success: true, message: "Signed out successfully" })
  } catch (error) {
    console.error("Sign-out API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
