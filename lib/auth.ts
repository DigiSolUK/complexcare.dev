/**
 * This file acts as an adapter to satisfy components that were
 * built with a standard NextAuth.js pattern (`import { authOptions, getSession } from '@/lib/auth'`).
 * It maps those calls to the custom "Stack Auth" implementation.
 */
import { getServerSession } from "@/lib/auth/stack-auth-server"

// There are no "authOptions" to export in Stack Auth, so we export a placeholder.
export const authOptions = {
  // This object can be expanded if components rely on specific properties.
  placeholder: "Stack Auth is used instead of NextAuth options.",
}

/**
 * Maps the `getSession` call to Stack Auth's `getServerSession`.
 */
export async function getSession() {
  return getServerSession()
}
