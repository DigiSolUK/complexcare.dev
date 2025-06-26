import { NextResponse } from "next/server"
import { getSession } from "@auth0/nextjs-auth0"

export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real implementation, this would query your database
    // For now, we'll return mock data
    return NextResponse.json({
      total_tenants: 5,
      active_tenants: 4,
      tenants_created_this_month: 1,
    })
  } catch (error) {
    console.error("Error fetching tenant statistics:", error)
    return NextResponse.json({ error: "Failed to fetch tenant statistics" }, { status: 500 })
  }
}
