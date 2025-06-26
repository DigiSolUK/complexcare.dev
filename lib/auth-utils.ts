// lib/auth-utils.ts (Root Level)
// This file provides demo authentication utilities.

import { getSession } from "@/lib/auth"
import type { User } from "@/types" // Assuming you have a User type defined

/**
 * In demo mode, this function returns a hardcoded demo user.
 * In a real application, this would fetch the authenticated user's details.
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession()
  // The getSession in lib/auth.ts already returns a demo user
  return session?.user || null
}
