import { neon } from "@neondatabase/serverless"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config()

async function runStartupChecks() {
  console.log("🚀 Running startup checks...\n")

  const checks = [] // Array to store check results

  // Check environment variables
  console.log("📋 Checking environment variables...")
  const requiredEnvVars = ["DATABASE_URL", "NEXTAUTH_SECRET", "NEXTAUTH_URL", "DEFAULT_TENANT_ID"]

  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      checks.push({
        name: `Environment: ${envVar}`,
        status: "pass",
      })
    } else {
      checks.push({
        name: `Environment: ${envVar}`,
        status: "fail",
        message: `Missing required environment variable: ${envVar}`,
      })
    }
  }

  // Check database connection
  console.log("\n🗄️  Checking database connection...")
  const databaseUrl = process.env.DATABASE_URL || process.env.production_DATABASE_URL // Use production_DATABASE_URL if available

  if (!databaseUrl) {
    checks.push({
      name: "Database Connection",
      status: "fail",
      message: "DATABASE_URL environment variable not set.",
    })
  } else {
    console.log(`Attempting to connect to: ${databaseUrl.replace(/^(postgres:\/\/[^:]+:[^@]+@)(.*)$/, "$1****@$2")}`) // Mask password
    try {
      const sql = neon(databaseUrl)
      const versionResult = await sql`SELECT version()`
      const currentUserResult = await sql`SELECT current_user`
      const currentDatabaseResult = await sql`SELECT current_database()`

      if (versionResult && versionResult.length > 0 && versionResult[0].version) {
        checks.push({
          name: "Database Connection",
          status: "pass",
          message: `Connected to ${versionResult[0].version} as user '${currentUserResult.rows[0].current_user}' on database '${currentDatabaseResult.rows[0].current_database}'`,
        })
      } else {
        checks.push({
          name: "Database Connection",
          status: "fail",
          message: "Failed to retrieve database version or empty result.",
        })
      }

      // Check required tables across all schemas
      const tables = [
        "tenants",
        "users",
        "patients",
        "appointments",
        "tasks",
        "care_professionals",
        "medications",
        "care_plans",
        "clinical_notes",
        "error_logs",
        "wearable_devices",
        "wearable_readings",
        "wearable_integration_settings",
        "office365_integration_settings",
        "office365_user_connections",
        "office365_email_sync",
        "office365_calendar_sync",
        "provider_availability",
        "time_off_requests",
      ]

      for (const table of tables) {
        try {
          const tableExistsResult = await sql.query(`
            SELECT table_schema, table_name
            FROM information_schema.tables
            WHERE table_name = '${table}'
            AND table_type = 'BASE TABLE';
          `)
          if (tableExistsResult && tableExistsResult.rows && tableExistsResult.rows.length > 0) {
            const schema = tableExistsResult.rows[0].table_schema
            checks.push({
              name: `Table: ${table}`,
              status: "pass",
              message: `Found in schema: ${schema}`,
            })
          } else {
            checks.push({
              name: `Table: ${table}`,
              status: "fail",
              message: "Table does not exist or query returned no rows in any schema.",
            })
          }
        } catch (error) {
          checks.push({
            name: `Table: ${table}`,
            status: "fail",
            message: `Error checking table: ${error.message}`,
          })
        }
      }
    } catch (error) {
      checks.push({
        name: "Database Connection",
        status: "fail",
        message: `Failed to connect to database: ${error instanceof Error ? error.message : String(error)}`,
      })
    }
  }

  // Print results
  console.log("\n📊 Startup Check Results:\n")

  let hasFailures = false

  for (const check of checks) {
    const icon = check.status === "pass" ? "✅" : "❌"
    console.log(`${icon} ${check.name}`)
    if (check.message) {
      console.log(`   ${check.message}`)
    }
    if (check.status === "fail") {
      hasFailures = true
    }
  }

  console.log("\n" + "=".repeat(50))

  if (hasFailures) {
    console.log("❌ Startup checks failed! Please fix the issues above.")
    process.exit(1)
  } else {
    console.log("✅ All startup checks passed! Ready to start the application.")
  }
}

// Run the checks
runStartupChecks().catch((error) => {
  console.error("Fatal error during startup checks:", error)
  process.exit(1)
})
