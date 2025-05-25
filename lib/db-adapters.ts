// This file provides adapter functions for database integrations
// to match the imports used in locked files

import { neon } from "@neondatabase/serverless"

// Re-export sql function with the same signature as expected
export const sql = neon(process.env.DATABASE_URL || "")
