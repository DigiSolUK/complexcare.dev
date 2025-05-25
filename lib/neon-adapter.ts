import { neon } from "@neondatabase/serverless"

// Export sql function for direct use in API routes
export const sql = process.env.DATABASE_URL
  ? neon(process.env.DATABASE_URL)
  : {
      // Provide a mock implementation when DATABASE_URL is not available
      query: async () => {
        console.warn("No DATABASE_URL provided, mock SQL client being used")
        return { rows: [] }
      },
    }
