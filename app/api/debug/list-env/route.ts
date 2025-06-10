import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Basic check: Can we even access process.env?
    const nodeEnv = process.env.NODE_ENV || "Not set"
    const vercelEnv = process.env.VERCEL_ENV || "Not set"

    // Try to get a specific, known database URL
    const dbUrlDirect = process.env.DATABASE_URL || "DATABASE_URL not set"
    const authDbUrlDirect = process.env.AUTH_DATABASE_URL || "AUTH_DATABASE_URL not set"
    const prodDbUrlDirect = process.env.production_DATABASE_URL || "production_DATABASE_URL not set"

    return NextResponse.json({
      message: "Simplified environment variable check.",
      NODE_ENV: nodeEnv,
      VERCEL_ENV: vercelEnv,
      DATABASE_URL_check: dbUrlDirect.substring(0, 50) + (dbUrlDirect.length > 50 ? "..." : ""), // Show a snippet
      AUTH_DATABASE_URL_check: authDbUrlDirect.substring(0, 50) + (authDbUrlDirect.length > 50 ? "..." : ""),
      production_DATABASE_URL_check: prodDbUrlDirect.substring(0, 50) + (prodDbUrlDirect.length > 50 ? "..." : ""),
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("CRITICAL ERROR in /api/debug/list-env:", error)
    // Return a very basic error response
    return new Response(
      JSON.stringify({
        error: "Critical error in API route",
        message: error.message,
        stack: error.stack ? error.stack.split("\n").slice(0, 5) : "No stack", // Send a snippet of the stack
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
