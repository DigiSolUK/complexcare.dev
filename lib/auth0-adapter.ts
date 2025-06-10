/**
 * This file is a shim to satisfy imports that may be looking for Auth0-specific functions.
 * It points to the centralized `lib/auth.ts` adapter.
 */
export { getSession } from "@/lib/auth"
