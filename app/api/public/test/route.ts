import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "success",
    message: "Public test endpoint is working",
    timestamp: new Date().toISOString(),
  })
}
