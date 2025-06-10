import { NextResponse } from "next/server"

export const runtime = "nodejs" // Force Node.js runtime

export async function GET() {
  try {
    const allEnvKeys = Object.keys(process.env).sort()
    const checkedVars: Record<string, string> = {}
    const importantVars = [
      // Database
      "DATABASE_URL",
      "POSTGRES_URL",
      "AUTH_DATABASE_URL",
      "production_DATABASE_URL",
      "production_POSTGRES_URL",
      "production_DATABASE_URL_UNPOOLED",
      "production_POSTGRES_URL_NON_POOLING",
      // Redis/KV
      "REDIS_URL",
      "REDIS_TOKEN",
      "KV_URL",
      "KV_REST_API_URL",
      "KV_REST_API_TOKEN",
      "KV_REST_API_READ_ONLY_TOKEN",
      // Auth (Stack & general)
      "STACK_SECRET_SERVER_KEY",
      "NEXT_PUBLIC_STACK_PROJECT_ID",
      "NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY",
      "JWT_SECRET",
      "NEXTAUTH_URL",
      "NEXTAUTH_SECRET",
      "DEFAULT_TENANT_ID",
      // API Keys & Services
      "GROQ_API_KEY",
      "BLOB_READ_WRITE_TOKEN",
      "TEST_API_TOKEN",
      // Application Behavior
      "BASE_URL",
      "NEXT_PUBLIC_APP_VERSION",
      "USE_MAIN_BRANCH",
      "SETUP_SECRET",
      "CI",
      "NEXT_PUBLIC_DEMO_MODE",
      // Vercel Specific (for context)
      "VERCEL_ENV",
      "VERCEL_URL",
      "NODE_ENV",
    ]

    importantVars.forEach((key) => {
      const value = process.env[key]
      if (value) {
        // Avoid logging full sensitive values
        if (
          key.includes("TOKEN") ||
          key.includes("SECRET") ||
          key.includes("KEY") ||
          key.includes("PASSWORD") ||
          key.includes("URL")
        ) {
          checkedVars[key] = `Present (length: ${value.length}, first 10: ${value.substring(0, 10)}...)`
        } else {
          checkedVars[key] = value
        }
      } else {
        checkedVars[key] = "NOT SET"
      }
    })

    const diagnostics = {
      message: "Vercel Environment Variable Check (Node.js Runtime)",
      timestamp: new Date().toISOString(),
      runtime_info: {
        node_version: process.version,
        vercel_env: process.env.VERCEL_ENV || "NOT SET",
        node_env: process.env.NODE_ENV || "NOT SET",
      },
      checked_variables: checkedVars,
      all_env_keys_detected_count: allEnvKeys.length,
      // all_env_keys_list: allEnvKeys, // Optionally include this if needed, but can be very long
    }

    return NextResponse.json(diagnostics)
  } catch (error: any) {
    console.error("CRITICAL ERROR in /api/diagnostics/env-check:", error)
    return NextResponse.json({ error: "Route crashed", message: error.message, stack: error.stack }, { status: 500 })
  }
}
