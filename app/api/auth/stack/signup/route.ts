// app/api/auth/stack/signup/route.ts
import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"
import { hashPassword, generateJwtToken } from "@/lib/auth/stack-auth-server"
import { z } from "zod"

const sql = neon(process.env.DATABASE_URL!)

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  name: z.string().optional(),
  // role: z.enum(["user", "admin", "superadmin"]).default("user"), // Allow specifying role at signup if desired
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validation = signupSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const { email, password, name } = validation.data

    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: "User with this email already exists." }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)

    // Default role for new signups is 'user'.
    // If you want to allow superadmins to create users with specific roles,
    // that logic would go into a separate admin API route.
    const defaultRole = "user"
    const defaultTenantId = process.env.DEFAULT_TENANT_ID || null // Assign a default tenant if applicable

    const newUserResult = await sql`
      INSERT INTO users (email, hashed_password, name, role, tenant_id)
      VALUES (${email}, ${hashedPassword}, ${name || null}, ${defaultRole}, ${defaultTenantId})
      RETURNING id, email, name, tenant_id, role
    `

    const newUser = newUserResult.rows[0]

    if (!newUser) {
      throw new Error("Failed to create user.")
    }

    const userPayload = {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      tenantId: newUser.tenant_id || process.env.DEFAULT_TENANT_ID || "default-tenant-id", // Fallback
      role: newUser.role,
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
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        tenantId: newUser.tenant_id,
        role: newUser.role,
      },
      message: "Account created successfully!",
    })
  } catch (error: any) {
    console.error("Signup API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
