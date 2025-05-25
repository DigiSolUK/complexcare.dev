// This file provides adapter functions for database integrations
// to match the imports used in locked files

import { neon } from "@neondatabase/serverless"

// Re-export sql function with the same signature as expected
export const sql = process.env.DATABASE_URL
  ? neon(process.env.DATABASE_URL)
  : {
      // Provide a mock implementation when DATABASE_URL is not available
      query: async () => {
        console.warn("No DATABASE_URL provided, mock SQL client being used")
        return { rows: [] }
      },
    }
