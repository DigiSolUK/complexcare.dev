import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // In a real scenario, you'd call your Stack Auth server-side SDK here
    // to authenticate the user and get a session token/cookie.
    // For this mock, we'll simulate success and set a mock cookie.

    if (email === "test@example.com" && password === "password") {
      // Simulate successful authentication
      const mockSessionToken = "mock-server-session-id" // This would come from Stack Auth
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        role: "user",
      }

      // Set a mock session cookie (replace with actual Stack Auth cookie handling)
      cookies().set("stack-session-id", mockSessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })

      return NextResponse.json({ success: true, user: mockUser })
    } else if (email === "admin@example.com" && password === "password") {
      const mockSessionToken = "mock-admin-token"
      const mockUser = {
        id: "admin-789",
        email: "admin@example.com",
        name: "Tenant Admin",
        role: "tenant_admin",
      }
      cookies().set("stack-session-id", mockSessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      })
      return NextResponse.json({ success: true, user: mockUser })
    } else if (email === "super@example.com" && password === "password") {
      const mockSessionToken = "mock-superadmin-token"
      const mockUser = {
        id: "superadmin-001",
        email: "super@example.com",
        name: "Super Admin",
        role: "superadmin",
      }
      cookies().set("stack-session-id", mockSessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      })
      return NextResponse.json({ success: true, user: mockUser })
    } else {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    console.error("Sign-in API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
