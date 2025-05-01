import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Return basic system information
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      auth0: {
        baseUrl: process.env.AUTH0_BASE_URL ? "configured" : "missing",
        issuerBaseUrl: process.env.AUTH0_ISSUER_BASE_URL ? "configured" : "missing",
        clientId: process.env.AUTH0_CLIENT_ID ? "configured" : "missing",
        clientSecret: process.env.AUTH0_CLIENT_SECRET ? "configured" : "missing",
        secret: process.env.AUTH0_SECRET ? "configured" : "missing",
      },
      database: {
        url: process.env.DATABASE_URL ? "configured" : "missing",
      },
    })
  } catch (error) {
    console.error("Debug API error:", error)
    return NextResponse.json({ error: "Debug API error", message: error.message }, { status: 500 })
  }
}
