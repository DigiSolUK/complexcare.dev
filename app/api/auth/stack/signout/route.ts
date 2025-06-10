// app/api/auth/stack/signout/route.ts
import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"

// Mocking a server-side sign-out
async function stackServerSignOut(sessionId: string) {
  const secretKey = process.env.STACK_SECRET_SERVER_KEY
  if (!secretKey) throw new Error("STACK_SECRET_SERVER_KEY not configured")
  // In a real scenario, you'd call Stack's API here to invalidate the session
  console.log(`Mock: Invalidating session ${sessionId} on Stack server`)
  return { success: true }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("stack-session-id")?.value // Replace with actual cookie name

    if (sessionId) {
      await stackServerSignOut(sessionId) // Inform Stack Auth backend if necessary
    }

    cookieStore.delete("stack-session-id") // Replace with actual cookie name

    return NextResponse.json({ success: true, message: "Signed out successfully" })
  } catch (error) {
    console.error("Stack Sign-out API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
