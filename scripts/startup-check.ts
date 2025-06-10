import { neon } from "@neondatabase/serverless"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config()

interface CheckResult {
  name: string
  status: "pass" | "fail"
  message?: string
}

async function runStartupChecks() {
  console.log("🚀 Running startup checks...\n")

  const checks: CheckResult[] = []

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
    const sql = neon(process.env.DATABASE_URL!)
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
      "error_logs",
    ]

    for (const table of tables) {
      try {
        await sql`SELECT COUNT(*) FROM ${sql(table)} LIMIT 1`
        checks.push({
          name: `Table: ${table}`,
          status: "pass",
        })
      } catch (error) {
        checks.push({
          name: `Table: ${table}`,
          status: "fail",
          message: "Table does not exist",
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
