import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check environment variables on the server side
    const envCheck = {
      AUTH0_CLIENT_ID: !!process.env.AUTH0_CLIENT_ID,
      AUTH0_CLIENT_SECRET: !!process.env.AUTH0_CLIENT_SECRET,
      AUTH0_ISSUER_BASE_URL: !!process.env.AUTH0_ISSUER_BASE_URL,
      AUTH0_BASE_URL: !!process.env.AUTH0_BASE_URL,
      AUTH0_SECRET: !!process.env.AUTH0_SECRET,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET, // Check secret on server side
    }

    return NextResponse.json({
      status: "success",
      message: "Auth0 configuration check completed",
      envCheck,
    })
  } catch (error) {
    console.error("Auth debug error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to check Auth0 configuration",
        error: String(error),
      },
      { status: 500 },
    )
  }
}

