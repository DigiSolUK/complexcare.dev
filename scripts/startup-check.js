import { neon } from "@neondatabase/serverless"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config()

// Define a simple type for check results (removed interface for JS compatibility)
// This is a JS file, so we'll use JSDoc for type hints if needed, or just rely on runtime checks.

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
        message: "Missing required environment variable",
      })
    }
  }

  // Check database connection
  console.log("\n🗄️  Checking database connection...")
  try {
    const sql = neon(process.env.DATABASE_URL)
    const result = await sql`SELECT version()`
    checks.push({
      name: "Database Connection",
      status: "pass",
      message: `Connected to ${result[0].version}`,
    })

    // Check required tables
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
      "error_logs", // Ensure error_logs is checked
      "wearable_devices", // Add wearable_devices to checks
      "wearable_readings", // Add wearable_readings to checks
      "wearable_integration_settings", // Add wearable_integration_settings to checks
      "office365_integration_settings", // Add office365_integration_settings to checks
      "office365_user_connections", // Add office365_user_connections to checks
      "office365_email_sync", // Add office365_email_sync to checks
      "office365_calendar_sync", // Add office365_calendar_sync to checks
      "provider_availability", // Add provider_availability to checks
      "time_off_requests", // Add time_off_requests to checks
    ]

    for (const table of tables) {
      try {
        // Use sql.query directly for table existence check
        const tableExistsResult = await sql.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name = '${table}'
          );
        `)
        if (tableExistsResult.rows[0].exists) {
          checks.push({
            name: `Table: ${table}`,
            status: "pass",
          })
        } else {
          checks.push({
            name: `Table: ${table}`,
            status: "fail",
            message: "Table does not exist",
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
      message: error instanceof Error ? error.message : "Unknown error",
    })
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
