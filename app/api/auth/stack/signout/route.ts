import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    // In a real scenario, you'd call your Stack Auth server-side SDK here
    // to invalidate the session. For this mock, we'll just clear the cookie.

    cookies().delete("stack-session-id") // Clear the session cookie

    return NextResponse.json({ success: true, message: "Signed out successfully" })
  } catch (error) {
    console.error("Sign-out API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
