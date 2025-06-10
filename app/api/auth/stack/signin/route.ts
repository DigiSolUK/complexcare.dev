// app/api/auth/stack/signin/route.ts
import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"
import { getUserByEmail, verifyPassword, generateJwtToken } from "@/lib/auth/stack-auth-server"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = await getUserByEmail(email)

    if (!user || !user.hashed_password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isValidPassword = await verifyPassword(password, user.hashed_password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    if (!user.tenant_id) {
      // Handle case where tenant_id might be null, or assign a default if appropriate
      // For now, we'll prevent login if tenant_id is missing, as it's crucial for multi-tenancy.
      console.error(`User ${user.id} is missing tenant_id.`)
      return NextResponse.json(
        { error: "User account configuration error. Missing tenant association." },
        { status: 500 },
      )
    }

    const userPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      tenantId: user.tenant_id, // Ensure tenant_id is included
    }

    const token = generateJwtToken(userPayload)

    const cookieStore = cookies()
    cookieStore.set("auth_session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: "lax",
    })

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, tenantId: user.tenant_id },
    })
  } catch (error) {
    console.error("Sign-in API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
