/**
 * This file acts as an adapter for components that might expect
 * a NextAuth.js-like `getSession` function.
 * It maps those calls to the custom Neon/Stack Auth implementation.
 */
import { getServerSession as getStackServerSession } from "@/lib/auth/stack-auth-server"
import type { UserPayload } from "@/lib/auth/stack-auth-server" // Assuming UserPayload is exported

// authOptions might not be relevant anymore, but keep a placeholder if strictly needed.
export const authOptions = {
  placeholder: "Custom Neon/Stack Auth is used.",
}

/**
 * Maps the `getSession` call to Stack Auth's `getServerSession`.
 * The return type should match what components expect, or components should be updated.
 */
export async function getSession(): Promise<{ user: UserPayload | null; tenantId?: string; error?: string } | null> {
  return getStackServerSession()
}
