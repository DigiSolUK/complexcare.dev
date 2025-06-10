// This file provides adapter functions for database integrations
// to match the imports used in locked files

import { neon } from "@neondatabase/serverless"

// Get the appropriate database URL based on available environment variables
function getDatabaseUrl(): string | undefined {
  // Check for various possible database URL environment variables
  const possibleEnvVars = [
    "DATABASE_URL",
    "POSTGRES_URL",
    "production_DATABASE_URL",
    "production_POSTGRES_URL",
    "AUTH_DATABASE_URL",
  ]

  for (const envVar of possibleEnvVars) {
    if (process.env[envVar] && process.env[envVar]!.trim() !== "") {
      console.log(`Using database connection from ${envVar}`)
      return process.env[envVar]!
    }
  }

  // If no valid connection string is found, return undefined
  console.warn("No database connection string found in environment variables.")
  return undefined
}

// Create a SQL client with proper error handling
const dbUrl = getDatabaseUrl()
export const sql = dbUrl
  ? neon(dbUrl)
  : {
      // Provide a mock implementation that throws a clear error
      query: () => {
        throw new Error(
          "Database connection not available. Please check your environment variables for a valid database connection string.",
        )
      },
    }
