import { cookies } from "next/headers"
import { executeQuery } from "@/lib/db"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

// Session management
export async function getSession() {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get("session_token")?.value

  if (!sessionToken) {
    return null
  }

  try {
    const sessions = await executeQuery(
      `
      SELECT s.*, u.* 
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = $1 AND s.expires_at > NOW()
    `,
      [sessionToken],
    )

    if (sessions.length === 0) {
      return null
    }

    const session = sessions[0]

    return {
      user: {
        id: session.user_id,
        name: session.name,
        email: session.email,
        role: session.role,
        tenantId: session.tenant_id,
      },
    }
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

// Authentication
export async function signIn(email: string, password: string) {
  try {
    // Find user by email
    const users = await executeQuery(
      `
      SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL
    `,
      [email],
    )

    if (users.length === 0) {
      return { success: false, message: "Invalid email or password" }
    }

    const user = users[0]

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      return { success: false, message: "Invalid email or password" }
    }

    // Create session
    const token = uuidv4()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

    await executeQuery(
      `
      INSERT INTO sessions (user_id, token, expires_at)
      VALUES ($1, $2, $3)
    `,
      [user.id, token, expiresAt],
    )

    // Set session cookie
    cookies().set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    })

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  } catch (error) {
    console.error("Sign in error:", error)
    return { success: false, message: "An error occurred during sign in" }
  }
}

export async function signOut() {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get("session_token")?.value

  if (sessionToken) {
    try {
      // Delete session from database
      await executeQuery(
        `
        DELETE FROM sessions WHERE token = $1
      `,
        [sessionToken],
      )
    } catch (error) {
      console.error("Error deleting session:", error)
    }
  }

  // Clear session cookie
  cookies().delete("session_token")

  redirect("/")
}

// Authorization
export async function requireAuth() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/signin?callbackUrl=" + encodeURIComponent(window.location.href))
  }

  return session
}

export async function requireRole(role: string | string[]) {
  const session = await getSession()

  if (!session) {
    redirect("/auth/signin?callbackUrl=" + encodeURIComponent(window.location.href))
  }

  const roles = Array.isArray(role) ? role : [role]

  if (!roles.includes(session.user.role)) {
    redirect("/unauthorized")
  }

  return session
}
