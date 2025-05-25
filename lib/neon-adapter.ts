import { neon } from "@neondatabase/serverless"

// Use the production database URL
const DATABASE_URL =
  process.env.DATABASE_URL || process.env.production_DATABASE_URL || process.env.production_POSTGRES_URL

// Export sql function for direct use in API routes
export const sql = neon(DATABASE_URL!)
