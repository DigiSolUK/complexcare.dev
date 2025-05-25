import { mockDb, shouldUseMockDb, getDbClient } from "./mock-db-provider"

// Export sql function for direct use in API routes
export const sql = shouldUseMockDb() ? mockDb : getDbClient()
