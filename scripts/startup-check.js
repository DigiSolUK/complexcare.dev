import { getNeonSqlClient } from "../lib/db"

async function checkTableExists(tableName) {
  const sql = getNeonSqlClient()
  try {
    const result = await sql`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = ${tableName}
      ) as exists_alias;
    `

    // Log the raw result for debugging
    console.log(`DEBUG: Raw result for table ${tableName}:`, JSON.stringify(result))

    // Explicitly check if result is null or undefined before anything else
    if (result === null || typeof result === "undefined") {
      console.error(`Error checking table ${tableName}: Query result is null or undefined.`)
      return false
    }

    // Ensure result is an array and has at least one element
    if (!Array.isArray(result) || result.length === 0) {
      console.error(`Error checking table ${tableName}: Query returned no rows or invalid result type. Result:`, result)
      return false
    }

    // Ensure the first element exists and has the 'exists_alias' property
    if (typeof result[0].exists_alias === "undefined") {
      console.error(
        `Error checking table ${tableName}: 'exists_alias' property not found in result[0]. Result[0]:`,
        result[0],
      )
      return false
    }

    return result[0].exists_alias
  } catch (error) {
    console.error(`Error checking table ${tableName}: ${error.message}`)
    return false
  }
}

async function runStartupChecks() {
  console.log("Running database startup checks...")

  const requiredTables = [
    "users",
    "accounts",
    "sessions",
    "verification_tokens",
    "tenants",
    "tenant_users",
    "patients",
    "care_professionals",
    "medications",
    "documents",
    "invoices",
    "invoice_items",
    "payroll_providers",
    "payroll_submissions",
    "credentials",
    "care_plans",
    "appointments",
    "availability",
    "time_off_requests",
    "error_logs",
    "clinical_notes",
    "clinical_note_categories",
    "clinical_note_templates",
    "wearable_devices",
    "wearable_readings",
    "timesheets",
  ]

  let allTablesExist = true
  for (const table of requiredTables) {
    const exists = await checkTableExists(table)
    if (!exists) {
      console.error(`❌ Table: ${table}`)
      allTablesExist = false
    } else {
      console.log(`✅ Table: ${table}`)
    }
  }

  if (!allTablesExist) {
    console.error("Database startup check failed: Not all required tables exist.")
    process.exit(1)
  } else {
    console.log("Database startup check passed: All required tables exist.")
  }
}

runStartupChecks()
