// Simple schema validator without commander
import { validateDatabaseSchema, generateFixSql } from "../lib/db/schema-validator"

async function main() {
  console.log("Validating database schema...")

  try {
    const result = await validateDatabaseSchema()

    console.log(`Schema validation ${result.isValid ? "passed" : "failed"} at ${result.timestamp}`)

    if (!result.isValid) {
      console.log(`Found ${result.mismatches.length} schema mismatches:`)

      result.mismatches.forEach((mismatch, index) => {
        console.log(`\n[${index + 1}] ${mismatch.type.toUpperCase()}: ${mismatch.entity}`)
        console.log(`  Expected: ${mismatch.expected}`)
        console.log(`  Actual: ${mismatch.actual || "missing"}`)
        console.log(`  Severity: ${mismatch.severity}`)
        console.log(`  Suggestion: ${mismatch.suggestion}`)
      })

      console.log("\nGenerated SQL to fix issues:")
      console.log(generateFixSql(result.mismatches))
    }
  } catch (error) {
    console.error("Schema validation failed:", error)
  }
}

// Run if this file is executed directly
main()
