/**
 * This file is a shim to satisfy imports that may be looking for a Neon-specific adapter.
 * It points to the centralized `lib/db.ts` export.
 */
export { sql } from "@/lib/db"
