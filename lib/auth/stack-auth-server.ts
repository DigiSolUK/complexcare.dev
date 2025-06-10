// lib/auth/stack-auth-server.ts (Server-side utilities for Neon Auth)
import type { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import type { Pool } from "@neondatabase/serverless"

// Ensure DATABASE_URL and JWT_SECRET are set in your environment variables
const DATABASE_URL = process.env.DATABASE_URL
const JWT_SECRET = process.env.JWT_SECRET

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set.")
}
if (!JWT_SECRET) {
  console.error("JWT_SECRET environment variable is not set.")
}

const sql: Pool = neon(DATABASE_URL!)

interface UserPayload {
  userId: string
  email: string
  name?: string
  tenantId: string
  role: string // Added role to the JWT payload
  // Add other relevant user fields to payload
}

export async function verifyPassword(password: string, hashedPassword?: string | null): Promise<boolean> {
  if (!hashedPassword) return false
  return bcrypt.compare(password, hashedPassword)
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export function generateJwtToken(payload: UserPayload): string {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not configured.")
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }) // Adjust expiration as needed
}

export function verifyJwtToken(token: string): UserPayload | null {
  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not configured for token verification.")
    return null
  }
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload
  } catch (error) {
    console.error("JWT verification failed:", error)
    return null
  }
}

export async function getServerSession(
  req?: NextRequest,
): Promise<{ user: UserPayload | null; tenantId?: string; error?: string } | null> {
  if (!JWT_SECRET || !DATABASE_URL) {
    return { user: null, error: "Auth server not configured (missing JWT_SECRET or DATABASE_URL)." }
  }

  let token: string | undefined

  const authHeader = req?.headers.get("Authorization")
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.substring(7)
  }

  if (!token) {
    const cookieStore = cookies()
    token = cookieStore.get("auth_session_token")?.value
  }

  if (!token) {
    return null
  }

  const decodedPayload = verifyJwtToken(token)

  if (decodedPayload) {
    return {
      user: decodedPayload,
      tenantId: decodedPayload.tenantId,
    }
  }

  return { user: null, error: "Invalid or expired session token." }
}

export async function requireAuth(
  req?: NextRequest,
): Promise<{ user: UserPayload; tenantId: string } | { error: string; status: number }> {
  const session = await getServerSession(req)
  if (!session || session.error || !session.user) {
    return { error: session?.error || "Unauthorized", status: 401 }
  }
  if (!session.user.tenantId) {
    const defaultTenantId = process.env.DEFAULT_TENANT_ID
    if (!defaultTenantId) {
      return { error: "Tenant ID not found for user and no default configured.", status: 403 }
    }
    session.user.tenantId = defaultTenantId
  }
  return { user: session.user, tenantId: session.user.tenantId }
}

// Function to get user by email from Neon DB, now including role
export async function getUserByEmail(email: string) {
  try {
    const result =
      await sql`SELECT id, email, hashed_password, name, tenant_id, role, avatar_url FROM users WHERE email = ${email}`
    return result.rows[0] || null
  } catch (error) {
    console.error("Error fetching user by email:", error)
    return null
  }
}

// Function to get user by ID from Neon DB, now including role
export async function getUserById(userId: string) {
  try {
    const result = await sql`SELECT id, email, name, tenant_id, role, avatar_url FROM users WHERE id = ${userId}`
    return result.rows[0] || null
  } catch (error) {
    console.error("Error fetching user by ID:", error)
    return null
  }
}
