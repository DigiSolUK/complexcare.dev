import { neon } from "@neondatabase/serverless"
import { redis } from "@/lib/redis/client"

export interface ConnectionTestResult {
  service: string
  success: boolean
  latency?: number
  error?: string
  details?: any
}

export class ConnectionTester {
  async testDatabaseConnection(): Promise<ConnectionTestResult> {
    const startTime = Date.now()
    try {
      const databaseUrl = process.env.production_DATABASE_URL || process.env.DATABASE_URL
      if (!databaseUrl) {
        throw new Error("No database URL configured")
      }

      const sql = neon(databaseUrl)
      const result = await sql`
        SELECT 
          version() as pg_version,
          current_database() as database_name,
          current_user as user_name,
          NOW() as server_time
      `

      const latency = Date.now() - startTime

      return {
        service: "PostgreSQL (Neon)",
        success: true,
        latency,
        details: {
          version: result[0].pg_version,
          database: result[0].database_name,
          user: result[0].user_name,
          serverTime: result[0].server_time,
        },
      }
    } catch (error) {
      return {
        service: "PostgreSQL (Neon)",
        success: false,
        latency: Date.now() - startTime,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  async testRedisConnection(): Promise<ConnectionTestResult> {
    const startTime = Date.now()
    try {
      const testKey = `test:${Date.now()}`
      const testValue = "connection-test"

      // Test write
      await redis.set(testKey, testValue, { ex: 10 })

      // Test read
      const retrievedValue = await redis.get(testKey)

      // Test delete
      await redis.del(testKey)

      const latency = Date.now() - startTime

      if (retrievedValue !== testValue) {
        throw new Error("Redis read/write test failed")
      }

      return {
        service: "Redis (Upstash)",
        success: true,
        latency,
        details: {
          operations: ["set", "get", "del"],
          testPassed: true,
        },
      }
    } catch (error) {
      return {
        service: "Redis (Upstash)",
        success: false,
        latency: Date.now() - startTime,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  async testAllConnections(): Promise<ConnectionTestResult[]> {
    const results = await Promise.all([this.testDatabaseConnection(), this.testRedisConnection()])

    return results
  }
}
