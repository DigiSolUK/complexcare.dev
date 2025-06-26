import { NextResponse } from "next/server"

export async function GET() {
  const stackPublishableClientKey = process.env.STACK_PUBLISHABLE_CLIENT_KEY
  const stackProjectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID

  if (!stackPublishableClientKey || !stackProjectId) {
    return NextResponse.json({ error: "Stack Auth configuration missing" }, { status: 500 })
  }

  return NextResponse.json({
    stackPublishableClientKey,
    stackProjectId,
  })
}
