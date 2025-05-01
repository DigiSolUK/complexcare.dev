import { neon } from "@neondatabase/serverless"

// Export sql function for direct use in API routes
export const sql = neon(process.env.DATABASE_URL!)
