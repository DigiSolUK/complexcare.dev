import { neon } from "@neondatabase/serverless"
import fs from "fs"
import path from "path"

export async function runDiagnostics() {
  const results = {
    environment: checkEnvironmentVariables(),
    database: await checkDatabaseConnection(),
    fileSystem: checkCriticalFiles(),
    nextConfig: checkNextConfig(),
  }

  return {
    success: Object.values(results).every((result) => result.status === "pass"),
    results,
  }
}

function checkEnvironmentVariables() {
  const requiredVars = ["DATABASE_URL", "NEXTAUTH_SECRET", "NEXTAUTH_URL"]

  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  return {
    status: missingVars.length === 0 ? "pass" : "fail",
    message:
      missingVars.length === 0
        ? "All required environment variables are set"
        : `Missing required environment variables: ${missingVars.join(", ")}`,
    details: {
      checked: requiredVars,
      missing: missingVars,
    },
  }
}

async function checkDatabaseConnection() {
  try {
    // Try to determine which database URL to use
    let databaseUrl = null
    const possibleEnvVars = [
      "DATABASE_URL",
      "POSTGRES_URL",
      "production_DATABASE_URL",
      "production_POSTGRES_URL",
      "AUTH_DATABASE_URL",
    ]

    for (const envVar of possibleEnvVars) {
      if (process.env[envVar]) {
        databaseUrl = process.env[envVar]
        break
      }
    }

    if (!databaseUrl) {
      return {
        status: "fail",
        message: "No database URL environment variable found",
        details: {
          checkedVars: possibleEnvVars,
        },
      }
    }

    // Test the connection
    const sql = neon(databaseUrl)
    const result = await sql`SELECT NOW() as time`

    return {
      status: "pass",
      message: "Database connection successful",
      details: {
        time: result[0]?.time,
        databaseUrl: databaseUrl.substring(0, 10) + "...", // Only show beginning for security
      },
    }
  } catch (error) {
    return {
      status: "fail",
      message: `Database connection failed: ${error instanceof Error ? error.message : String(error)}`,
      details: { error },
    }
  }
}

function checkCriticalFiles() {
  const criticalFiles = ["app/layout.tsx", "app/page.tsx", "middleware.ts", "lib/db/index.ts", "lib/auth.ts"]

  const missingFiles = criticalFiles.filter((file) => {
    try {
      return !fs.existsSync(path.join(process.cwd(), file))
    } catch (error) {
      return true
    }
  })

  return {
    status: missingFiles.length === 0 ? "pass" : "fail",
    message:
      missingFiles.length === 0 ? "All critical files exist" : `Missing critical files: ${missingFiles.join(", ")}`,
    details: {
      checked: criticalFiles,
      missing: missingFiles,
    },
  }
}

function checkNextConfig() {
  try {
    const configPath = path.join(process.cwd(), "next.config.js")
    const configExists = fs.existsSync(configPath)

    if (!configExists) {
      return {
        status: "fail",
        message: "next.config.js file not found",
      }
    }

    // We don't actually load the config to avoid execution issues
    return {
      status: "pass",
      message: "next.config.js file exists",
    }
  } catch (error) {
    return {
      status: "fail",
      message: `Error checking Next.js config: ${error instanceof Error ? error.message : String(error)}`,
      details: { error },
    }
  }
}
