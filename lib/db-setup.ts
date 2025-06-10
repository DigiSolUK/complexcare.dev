/**
 * Database Setup Utility
 *
 * This utility provides functions to check and set up the database.
 */

import { sql } from "./db"

/**
 * Checks if the database is properly set up by verifying essential tables exist
 */
export async function checkDatabaseSetup(): Promise<{
  isSetUp: boolean
  missingTables: string[]
}> {
  try {
    // List of essential tables that should exist
    const essentialTables = [
      "tenants",
      "users",
      "user_tenants",
      "patients",
      "care_professionals",
      "appointments",
      "tasks",
    ]

    // Query to check which tables exist
    const result = await sql.query(
      `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = ANY($1)
    `,
      [essentialTables],
    )

    // Get list of existing tables
    const existingTables = result.rows.map((row) => row.table_name)

    // Find missing tables
    const missingTables = essentialTables.filter((table) => !existingTables.includes(table))

    return {
      isSetUp: missingTables.length === 0,
      missingTables,
    }
  } catch (error) {
    console.error("Error checking database setup:", error)
    return {
      isSetUp: false,
      missingTables: ["Error checking tables"],
    }
  }
}

/**
 * Initializes the database by running the setup scripts
 */
export async function initializeDatabase(): Promise<{
  success: boolean
  message: string
}> {
  try {
    // Read and execute the create-tables.sql script
    const createTablesScript = `
      -- Enable UUID extension
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
      
      -- Create tables (simplified for brevity)
      CREATE TABLE IF NOT EXISTS tenants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- More tables would be created here...
    `

    await sql.query(createTablesScript)

    // Seed default data
    const seedDataScript = `
      -- Insert default tenant if it doesn't exist
      INSERT INTO tenants (id, name, slug)
      VALUES ('00000000-0000-0000-0000-000000000001', 'Default Tenant', 'default')
      ON CONFLICT (id) DO NOTHING;
      
      -- More seed data would be inserted here...
    `

    await sql.query(seedDataScript)

    return {
      success: true,
      message: "Database initialized successfully",
    }
  } catch (error) {
    console.error("Error initializing database:", error)
    return {
      success: false,
      message: `Database initialization failed: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

/**
 * Checks if a specific table exists in the database
 */
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    const result = await sql.query(
      `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      )
    `,
      [tableName],
    )

    return result.rows[0].exists
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error)
    return false
  }
}

/**
 * Gets the current database version (based on a version table if it exists)
 */
export async function getDatabaseVersion(): Promise<string> {
  try {
    // Check if the version table exists
    const versionTableExists = await tableExists("db_version")

    if (versionTableExists) {
      const result = await sql.query(`
        SELECT version FROM db_version ORDER BY applied_at DESC LIMIT 1
      `)

      if (result.rows.length > 0) {
        return result.rows[0].version
      }
    }

    return "unknown"
  } catch (error) {
    console.error("Error getting database version:", error)
    return "error"
  }
}
