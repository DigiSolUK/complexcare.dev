// app/api/auth/stack/signup/route.ts
import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"
import { hashPassword, generateJwtToken } from "@/lib/auth/stack-auth-server" // Re-using hashPassword and generateJwtToken
import { z } from "zod" // For input validation

const sql = neon(process.env.DATABASE_URL!)

// Define schema for input validation
const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  name: z.string().optional(),
  // tenantId: z.string().uuid().optional(), // If you want to allow specifying tenant at signup
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validation = signupSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const { email, password, name } = validation.data

    // Check if user already exists
    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: "User with this email already exists." }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)

    // For initial signup, tenant_id can be null or a default.
    // In a real multi-tenant system, new users might be invited to a tenant,
    // or a new tenant might be created for them.
    // For now, we'll insert with a NULL tenant_id, assuming a separate tenant assignment process.
    const newUserResult = await sql`
      INSERT INTO users (email, hashed_password, name)
      VALUES (${email}, ${hashedPassword}, ${name || null})
      RETURNING id, email, name, tenant_id
    `

    const newUser = newUserResult.rows[0]

    if (!newUser) {
      throw new Error("Failed to create user.")
    }

    // Generate JWT token for the new user
    // If tenant_id is null at signup, you might need a default or handle it later.
    // For now, we'll use a placeholder if tenant_id is null.
    const userPayload = {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      tenantId: newUser.tenant_id || process.env.DEFAULT_TENANT_ID || "default-tenant-id", // Fallback
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
      user: { id: newUser.id, email: newUser.email, name: newUser.name, tenantId: newUser.tenant_id },
      message: "Account created successfully!",
    })
  } catch (error: any) {
    console.error("Signup API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
