// app/api/auth/stack/signin/route.ts
import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"
// Assume stack-auth-client has a server-compatible signIn method or you have a server SDK method
// For this example, we'll use a mock. Replace with actual Stack Auth server SDK calls.

// Mocking a server-side sign-in that would typically interact with Stack's backend
async function stackServerSignIn(email: string, password?: string, provider?: string) {
  const secretKey = process.env.STACK_SECRET_SERVER_KEY
  if (!secretKey) throw new Error("STACK_SECRET_SERVER_KEY not configured")

  // In a real scenario, you'd call Stack's API here with the secret key
  // For example: const response = await fetch(`https://api.stackauth.com/signin`, { method: 'POST', ... })
  if (email === "test@example.com" && password === "password") {
    return {
      success: true,
      sessionId: "mock-server-session-id",
      user: { id: "user-123", email: "test@example.com", name: "Test User" },
    }
  }
  return { success: false, error: "Invalid credentials" }
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, provider } = await req.json()

    if (!email || (!password && !provider)) {
      return NextResponse.json({ error: "Email and password (or provider) are required" }, { status: 400 })
    }

    // Replace with actual Stack Auth server-side sign-in logic
    const signInResponse = await stackServerSignIn(email, password, provider)

    if (signInResponse.success && signInResponse.sessionId) {
      const cookieStore = cookies()
      cookieStore.set("stack-session-id", signInResponse.sessionId, {
        // Replace with actual cookie name and options
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })
      return NextResponse.json({ success: true, user: signInResponse.user })
    } else {
      return NextResponse.json({ error: signInResponse.error || "Sign-in failed" }, { status: 401 })
    }
  } catch (error) {
    console.error("Stack Sign-in API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
