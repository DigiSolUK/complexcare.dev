import { NextResponse } from "next/server"

// Explicitly force the Node.js runtime to ensure full access to process.env
export const runtime = "nodejs"

export async function GET() {
  try {
    const diagnostics = {
      message: "Vercel Environment Variable Check (Node.js Runtime)",
      timestamp: new Date().toISOString(),
      runtime_info: {
        node_version: process.version,
        vercel_env: process.env.VERCEL_ENV || "NOT SET",
        node_env: process.env.NODE_ENV || "NOT SET",
      },
      database_variables: {
        DATABASE_URL: process.env.DATABASE_URL ? `Present, length: ${process.env.DATABASE_URL.length}` : "NOT SET",
        POSTGRES_URL: process.env.POSTGRES_URL ? `Present, length: ${process.env.POSTGRES_URL.length}` : "NOT SET",
        AUTH_DATABASE_URL: process.env.AUTH_DATABASE_URL
          ? `Present, length: ${process.env.AUTH_DATABASE_URL.length}`
          : "NOT SET",
        production_DATABASE_URL: process.env.production_DATABASE_URL
          ? `Present, length: ${process.env.production_DATABASE_URL.length}`
          : "NOT SET",
      },
      other_key_variables: {
        GROQ_API_KEY: process.env.GROQ_API_KEY ? "Present" : "NOT SET",
        REDIS_URL: process.env.REDIS_URL ? "Present" : "NOT SET",
        STACK_SECRET_SERVER_KEY: process.env.STACK_SECRET_SERVER_KEY ? "Present" : "NOT SET",
      },
    }

    return NextResponse.json(diagnostics)
  } catch (error: any) {
    console.error("CRITICAL ERROR in /api/diagnostics/env-check:", error)
    return NextResponse.json(
      {
        error: "The /api/diagnostics/env-check route itself crashed.",
        message: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
