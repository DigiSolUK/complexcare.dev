import { NextResponse } from "next/server"
import { exec } from "child_process"
import path from "path"
import { requireAdmin } from "@/lib/auth-utils"

export async function POST(request: Request) {
  try {
    // Check if the user has admin permissions
    const authResult = await requireAdmin(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized. Admin permissions required." }, { status: 403 })
    }

    // Path to the generator script
    const generatorPath = path.join(process.cwd(), "scripts", "generate-schema-docs.ts")

    // Execute the generator script
    const execPromise = () => {
      return new Promise((resolve, reject) => {
        exec(`ts-node ${generatorPath}`, (error, stdout, stderr) => {
          if (error) {
            reject(error)
            return
          }
          if (stderr) {
            console.warn(`stderr: ${stderr}`)
          }
          resolve(stdout)
        })
      })
    }

    const output = await execPromise()

    return NextResponse.json({
      success: true,
      message: "Database schema documentation generated successfully",
      output,
    })
  } catch (error) {
    console.error("Error generating database schema documentation:", error)
    return NextResponse.json(
      {
        error: "Failed to generate database schema documentation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
