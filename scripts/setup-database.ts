#!/usr/bin/env node

/**
 * Database Setup Script
 *
 * This script sets up the database for the ComplexCare CRM application.
 * It creates the necessary tables and seeds initial data.
 */

import { Pool } from "pg"
import * as fs from "fs"
import * as path from "path"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config()

// Get database URL from environment variables
function getDatabaseUrl() {
  const possibleEnvVars = [
    "DATABASE_URL",
    "POSTGRES_URL",
    "production_DATABASE_URL",
    "production_POSTGRES_URL",
    "AUTH_DATABASE_URL",
  ]

  for (const envVar of possibleEnvVars) {
    if (process.env[envVar] && process.env[envVar].trim() !== "") {
      console.log(`Using database connection from ${envVar}`)
      return process.env[envVar]
    }
  }

  console.error("No database connection string found in environment variables.")
  process.exit(1)
}

async function setupDatabase() {
  const dbUrl = getDatabaseUrl()

  console.log("Setting up database...")

  // Create a connection pool
  const pool = new Pool({
    connectionString: dbUrl,
    ssl: dbUrl.includes("localhost") ? false : { rejectUnauthorized: false },
  })

  try {
    // Get a client from the pool
    const client = await pool.connect()

    try {
      // Read SQL scripts
      const createTablesScript = fs.readFileSync(path.join(__dirname, "create-tables.sql"), "utf8")

      const seedDefaultDataScript = fs.readFileSync(path.join(__dirname, "seed-default-data.sql"), "utf8")

      console.log("Creating tables...")
      await client.query(createTablesScript)
      console.log("✅ Tables created successfully")

      console.log("Seeding default data...")
      await client.query(seedDefaultDataScript)
      console.log("✅ Default data seeded successfully")

      // Check if tables were created
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `)

      console.log(`\nDatabase setup complete. Created ${tablesResult.rows.length} tables:`)
      tablesResult.rows.forEach((row) => {
        console.log(`- ${row.table_name}`)
      })
    } finally {
      // Release the client back to the pool
      client.release()
    }
  } catch (err) {
    console.error("❌ Database setup failed!")
    console.error(err.message)
    process.exit(1)
  } finally {
    // Close the pool
    await pool.end()
  }
}

// Run the setup
setupDatabase()
