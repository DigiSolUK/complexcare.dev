import { NextResponse } from "next/server"

export async function GET() {
  // Only return safe environment variables
  const safeEnvVars = {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL ? "✓ Set" : "✗ Not set",
    AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL ? "✓ Set" : "✗ Not set",
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID ? "✓ Set" : "✗ Not set",
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET ? "✓ Set" : "✗ Not set",
    AUTH0_SECRET: process.env.AUTH0_SECRET ? "✓ Set" : "✗ Not set",
    DATABASE_URL: process.env.DATABASE_URL ? "✓ Set" : "✗ Not set",
  }

  return NextResponse.json(safeEnvVars)
}

