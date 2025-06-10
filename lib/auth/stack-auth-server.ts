// lib/auth/stack-auth-server.ts (Server-side utilities)
// Placeholder for Stack Auth SDK server-side methods (e.g., session/token validation)
import type { NextRequest } from "next/server"
import { cookies } from "next/headers"

// Presumed Stack Auth Server SDK import - replace with actual
// import { StackAuthServer } from 'stack-auth-sdk/server';

let stackAuthServer: any // Replace 'any' with actual SDK server type

function getStackAuthServer() {
  if (stackAuthServer) {
    return stackAuthServer
  }

  const secretKey = process.env.STACK_SECRET_SERVER_KEY
  const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID

  if (!secretKey || !projectId) {
    console.warn("Stack Auth server-side environment variables not set. Server-side auth validation will not work.")
    return null
  }

  try {
    // Placeholder: Initialize Stack Auth Server SDK
    // stackAuthServer = new StackAuthServer({ secretKey, projectId });
    // console.log("Stack Auth server SDK initialized.");

    // Mock implementation for now
    stackAuthServer = {
      verifyToken: async (token: string) => {
        if (token === "mock-jwt-token" || token === "mock-server-session-id") {
          return {
            valid: true,
            userId: "user-123",
            email: "test@example.com",
            name: "Test User",
            role: "user", // Added role
            tenantId: "ba367cfe-6de0-4180-9566-1002b75cf82c", // Default tenant for mock
          }
        }
        if (token === "mock-admin-token") { // For testing admin roles
          return {
            valid: true,
            userId: "admin-789",
            email: "admin@example.com",
            name: "Tenant Admin",
            role: "tenant_admin",
            tenantId: "ba367cfe-6de0-4180-9566-1002b75cf82c",
          };
        }
        if (token === "mock-superadmin-token") { // For testing superadmin roles
          return {
            valid: true,
            userId: "superadmin-001",
            email: "super@example.com",
            name: "Super Admin",
            role: "superadmin",
            // Superadmin might not have a specific tenantId or a global one
          };
        }
        return { valid: false, error: "Invalid token" }
      },
      // Add other server methods like creating sessions, handling webhooks etc.
    }
    return stackAuthServer
  } catch (error) {
    console.error("Failed to initialize Stack Auth server SDK:", error)
    return null
  }
}

export async function getServerSession(
  req?: NextRequest,
): Promise<{ user: any; tenantId?: string; error?: string } | null> {
  const serverAuth = getStackAuthServer()
  if (!serverAuth) {
    return { error: "Auth server not configured" }
  }

  // Prefer Authorization header (Bearer token) for API requests
  const authHeader = req?.headers.get("Authorization")
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7)
    const verificationResult = await serverAuth.verifyToken(token)
    if (verificationResult.valid) {
      return {
        user: { id: verificationResult.userId, email: verificationResult.email, name: verificationResult.name, role: verificationResult.role },
        tenantId: verificationResult.tenantId,
      }
    }
  }

  // Fallback to cookie-based session for web requests
  const cookieStore = cookies() // Can only be called in Server Components or Route Handlers
  const sessionCookie = cookieStore.get("stack-session-id") // Replace with actual cookie name

  if (sessionCookie?.value) {
    const verificationResult = await serverAuth.verifyToken(sessionCookie.value)
    if (verificationResult.valid) {
      return {
        user: { id: verificationResult.userId, email: verificationResult.email, name: verificationResult.name, role: verificationResult.role },
        tenantId: verificationResult.tenantId,
      }
    }
  }

  return null
}

// Utility to protect API routes or Server Actions
export async function requireAuth(
  req?: NextRequest,
): Promise<{ user: any; tenantId: string } | { error: string; status: number }> {
  const session = await getServerSession(req)
  if (!session || session.error || !session.user) {
    return { error: session?.error || "Unauthorized", status: 401 }
  }
  // Ensure tenantId is present. You might get this from the user's session or a default.
  const tenantId = session.tenantId || process.env.DEFAULT_TENANT_ID || "ba367cfe-6de0-4180-9566-1002b75cf82c"
  if (!tenantId) {
    return { error: "Tenant ID not found for user", status: 403 }
  }
  return { user: session.user, tenantId }
}
