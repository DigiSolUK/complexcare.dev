import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth/stack-auth-server" // Ensure this path is correct

export const runtime = "nodejs"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(request) // Pass request if your getServerSession needs it for headers/cookies

    if (session && session.user) {
      return NextResponse.json({
        status: "Authenticated",
        message: "User session found.",
        user: {
          id: session.user.id,
          email: session.user.email, // Add other relevant, non-sensitive fields
          role: (session.user as any).role || "N/A", // Example, adjust to your user object structure
        },
        tenantId: session.tenantId || "N/A",
      })
    } else {
      return NextResponse.json({
        status: "Not Authenticated",
        message: "No active user session found.",
      })
    }
  } catch (error: any) {
    console.error("Error in /api/diagnostics/auth-check:", error)
    return NextResponse.json({ status: "Error", message: error.message, details: error.stack }, { status: 500 })
  }
}
