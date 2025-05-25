// Mock database provider for preview environment
export const mockDb = {
  query: async (query: string, params?: any[]) => {
    console.log("Mock DB Query:", query, params)
    return { rows: [] }
  },
  sql: (strings: TemplateStringsArray, ...values: any[]) => {
    console.log("Mock SQL Template:", strings, values)
    return { rows: [] }
  },
}

// Helper function to determine if we should use the mock database
export function shouldUseMockDb() {
  return !process.env.DATABASE_URL || process.env.NODE_ENV === "development" || typeof window !== "undefined"
}

// Get the appropriate database client (real or mock)
export function getDbClient() {
  if (shouldUseMockDb()) {
    console.log("Using mock database client")
    return mockDb
  }

  // This code will only run on the server with a valid DATABASE_URL
  try {
    // Dynamic import to prevent client-side loading
    const { neon } = require("@neondatabase/serverless")
    return neon(process.env.DATABASE_URL!)
  } catch (error) {
    console.error("Error initializing Neon client:", error)
    return mockDb
  }
}
