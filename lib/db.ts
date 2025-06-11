import { neon, type NeonQueryFunction } from "@neondatabase/serverless"
import { v4 as uuidv4 } from "uuid" // Import uuid for generating tokens

let sqlClient: NeonQueryFunction<false, false>

export function getNeonSqlClient(): NeonQueryFunction<false, false> {
  if (sqlClient) {
    return sqlClient
  }

  const possibleEnvVars = [
    "DATABASE_URL",
    "POSTGRES_URL",
    "production_DATABASE_URL",
    "production_POSTGRES_URL",
    "DATABASE_URL_UNPOOLED",
    "POSTGRES_URL_NON_POOLING",
    "production_DATABASE_URL_UNPOOLED",
    "production_POSTGRES_URL_NON_POOLING",
    "AUTH_DATABASE_URL",
  ]

  let dbUrl: string | undefined = undefined
  for (const envVar of possibleEnvVars) {
    if (process.env[envVar] && process.env[envVar]!.trim() !== "") {
      dbUrl = process.env[envVar]!
      console.log(`lib/db.ts: Using database connection string from environment variable: ${envVar}`)
      break
    }
  }

  if (!dbUrl) {
    console.error("lib/db.ts: FATAL: No suitable database connection string found in environment variables.")
    console.error("lib/db.ts: Checked for:", possibleEnvVars.join(", "))
    throw new Error(
      "Database connection string not configured. Check server logs for details. Application cannot connect to the database.",
    )
  }

  try {
    sqlClient = neon(dbUrl)
    console.log("lib/db.ts: Neon SQL client initialized successfully.")
    return sqlClient
  } catch (error) {
    console.error("lib/db.ts: Failed to initialize Neon SQL client:", error)
    throw new Error("Could not initialize database connection.")
  }
}

export const neonSql = getNeonSqlClient()
export const sql = neonSql // Alias for compatibility
export const db = neonSql // New alias for 'db' export

export async function executeQuery<T = any>(queryTemplate: TemplateStringsArray, ...params: any[]): Promise<T[]> {
  try {
    const client = getNeonSqlClient()
    const result = await client(queryTemplate, ...params)
    return result as T[]
  } catch (error) {
    console.error("lib/db.ts: Database query error:", error)
    throw error
  }
}

// Generic helper functions to satisfy missing exports
export async function getById<T>(tableName: string, id: string): Promise<T | null> {
  const result = await neonSql`SELECT * FROM ${neonSql(tableName)} WHERE id = ${id}`
  return result.length > 0 ? (result[0] as T) : null
}

export async function insert<T>(tableName: string, data: Record<string, any>): Promise<T> {
  const columns = Object.keys(data).map((key) => neonSql(key))
  const values = Object.values(data)
  const result = await neonSql`
    INSERT INTO ${neonSql(tableName)} (${columns}) 
    VALUES (${values}) 
    RETURNING *
  `
  return result[0] as T
}

export async function update<T>(tableName: string, id: string, data: Record<string, any>): Promise<T | null> {
  const setClauses = Object.keys(data).map((key) => neonSql`${neonSql(key)} = ${data[key]}`)
  const result = await neonSql`
    UPDATE ${neonSql(tableName)} 
    SET ${neonSql.join(setClauses, ", ")} 
    WHERE id = ${id} 
    RETURNING *
  `
  return result.length > 0 ? (result[0] as T) : null
}

export async function remove(tableName: string, id: string): Promise<boolean> {
  // Using soft delete if 'deleted_at' column exists, otherwise hard delete.
  // This is a simplified check. A more robust solution would inspect table schema.
  try {
    const result = await neonSql`
      UPDATE ${neonSql(tableName)} 
      SET deleted_at = NOW() 
      WHERE id = ${id}`
    if (result.rowCount > 0) return true
  } catch (e) {
    // Likely no 'deleted_at' column, fallback to hard delete
    const result = await neonSql`DELETE FROM ${neonSql(tableName)} WHERE id = ${id}`
    return result.rowCount > 0
  }
  return false
}

export async function testDatabaseConnectionInApp(): Promise<{
  connected: boolean
  message: string
  details?: any
  envUsed?: string
}> {
  let envUsedForTest: string | undefined = undefined
  try {
    const possibleEnvVars = [
      "DATABASE_URL",
      "POSTGRES_URL",
      "production_DATABASE_URL",
      "production_POSTGRES_URL",
      "DATABASE_URL_UNPOOLED",
      "POSTGRES_URL_NON_POOLING",
      "production_DATABASE_URL_UNPOOLED",
      "production_POSTGRES_URL_NON_POOLING",
      "AUTH_DATABASE_URL",
    ]
    for (const envVar of possibleEnvVars) {
      if (process.env[envVar] && process.env[envVar]!.trim() !== "") {
        envUsedForTest = envVar
        break
      }
    }

    const client = getNeonSqlClient()
    const result = await client`SELECT NOW() as time`
    return {
      connected: true,
      message: "Database connection successful from within the application.",
      details: { time: result[0]?.time },
      envUsed: envUsedForTest || "Could not determine specific env var used by getNeonSqlClient for this test",
    }
  } catch (error: any) {
    return {
      connected: false,
      message: error.message || "Database connection failed from within the application.",
      details: { error: error.toString() },
      envUsed: envUsedForTest,
    }
  }
}

// New functions for tenant invitations
export async function createTenantInvitation(
  tenantId: string,
  email: string,
  role: string,
  expiresAt: Date,
): Promise<{ id: string; token: string }> {
  const token = uuidv4() // Generate a unique token
  const result = await neonSql`
    INSERT INTO tenant_invitations (tenant_id, email, role, token, expires_at, created_at, updated_at)
    VALUES (${tenantId}, ${email}, ${role}, ${token}, ${expiresAt.toISOString()}, NOW(), NOW())
    RETURNING id, token
  `
  return result[0]
}

export async function getTenantInvitationByToken(token: string): Promise<any | null> {
  const result = await neonSql`
    SELECT * FROM tenant_invitations
    WHERE token = ${token} AND accepted_at IS NULL AND expires_at > NOW()
    LIMIT 1
  `
  return result.length > 0 ? result[0] : null
}

export async function updateTenantInvitationAcceptedAt(id: string, acceptedByUserId: string): Promise<boolean> {
  const result = await neonSql`
    UPDATE tenant_invitations
    SET accepted_at = NOW(), accepted_by_user_id = ${acceptedByUserId}, updated_at = NOW()
    WHERE id = ${id}
  `
  return result.rowCount > 0
}
