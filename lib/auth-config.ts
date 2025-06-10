/**
 * This file is a shim to satisfy imports that may be looking for an Auth0/NextAuth config.
 * It points to the centralized `lib/auth.ts` adapter.
 */
export { authOptions } from "@/lib/auth"
