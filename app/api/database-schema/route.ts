import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const docPath = path.join(process.cwd(), "docs", "database-schema.md")

    // Check if the file exists
    if (!fs.existsSync(docPath)) {
      return NextResponse.json({ error: "Database schema documentation not found" }, { status: 404 })
    }

    // Read the file
    const content = fs.readFileSync(docPath, "utf-8")

    return NextResponse.json({
      success: true,
      content,
    })
  } catch (error) {
    console.error("Error fetching database schema documentation:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch database schema documentation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
