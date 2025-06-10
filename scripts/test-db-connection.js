// This is the script from the previous response.
// Run this locally with `node scripts/test-db-connection.js`
// after setting your DATABASE_URL (or equivalent) in your local environment.
// scripts/test-db-connection.js
// This script tests the database connection and lists all available environment variables.

import { Pool } from "pg"

// Function to get the first available database URL from a list of env vars
function getDatabaseUrl() {
  console.log("Attempting to find database URL from environment variables for test-db-connection.js...")
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
    const value = process.env[envVar]
    let displayValue = "NOT SET"
    if (value && value.trim() !== "") {
      displayValue = value.length > 60 ? value.substring(0, 60) + "..." : value
    }
    console.log(`- Checking env var: ${envVar} = ${displayValue}`)

    if (value && value.trim() !== "") {
      console.log(`✅ Using database connection string from environment variable: ${envVar}`)
      return value
    }
  }

  console.error("❌ Critical Error: No suitable database connection string found in environment variables.")
  console.error("Checked for:", possibleEnvVars.join(", "))
  throw new Error("Database connection string not found.")
}

async function listAllEnvVars() {
  console.log("\n--- LISTING ALL AVAILABLE process.env KEYS ---")
  const envKeys = Object.keys(process.env).sort()
  if (envKeys.length === 0) {
    console.log("No environment variables found in process.env.")
  } else {
    console.log("Available keys:", envKeys.join(", "))
    const commonKeys = [
      "VERCEL_ENV",
      "VERCEL_URL",
      "NEXT_PUBLIC_VERCEL_URL",
      "NODE_ENV",
      "CI",
      "NEXT_PUBLIC_APP_VERSION",
      "NEXT_PUBLIC_STACK_PROJECT_ID",
      "DATABASE_URL",
      "POSTGRES_URL",
      "production_DATABASE_URL",
      "production_POSTGRES_URL",
      "AUTH_DATABASE_URL",
    ]
    console.log("\n--- Values for some common/expected keys ---")
    commonKeys.forEach((key) => {
      if (process.env[key]) {
        const value = process.env[key]
        const displayValue = value.length > 60 ? value.substring(0, 60) + "..." : value
        console.log(`- ${key} = ${displayValue}`)
      } else {
        console.log(`- ${key} = NOT SET`)
      }
    })
  }
  console.log("--- END LISTING ENV KEYS ---\n")
}

async function testConnection() {
  await listAllEnvVars()

  let dbUrl
  try {
    dbUrl = getDatabaseUrl()
  } catch (error) {
    console.error(error.message)
    console.log("\nConnection test cannot proceed without a database URL.")
    return
  }

  console.log(
    `Attempting to connect to the database with the retrieved URL (first 60 chars): ${dbUrl.substring(0, 60)}...`,
  )

  const pool = new Pool({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  })

  try {
    const client = await pool.connect()
    console.log("✅ Connection successful!")
    const versionResult = await client.query("SELECT version()")
    console.log(`- Database version: ${versionResult.rows[0].version}`)
    const nowResult = await client.query("SELECT NOW()")
    console.log(`- Current DB time: ${nowResult.rows[0].now}`)
    client.release()
  } catch (err) {
    console.error("❌ Connection failed!")
    console.error("Error Message:", err.message)
    if (err.stack) {
      console.error("Stack Trace:", err.stack)
    }
    if (err.code) {
      console.error("Error Code:", err.code)
    }
    if (dbUrl.includes("your_user") || dbUrl.includes("your_password") || dbUrl.includes("your_host")) {
      console.warn("⚠️ Warning: The database URL seems to contain placeholder values. Please ensure it's correctly set.")
    }
  } finally {
    if (pool) {
      await pool.end()
    }
    console.log("\nConnection test finished.")
  }
}

testConnection()
