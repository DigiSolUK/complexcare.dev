// This is the code from the previous response, which includes improved error handling.
// Ensure this version is active in your project.
import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db" // Using the user-provided robust db connection

export async function GET(request: Request) {
  try {
    const query = `
      SELECT
        table_name,
        column_name,
        ordinal_position,
        data_type,
        is_nullable,
        column_default
      FROM
        information_schema.columns
      WHERE
        table_schema = 'public'
      ORDER BY
        table_name,
        ordinal_position;
    `

    const columns = await executeQuery(query)

    if (!columns || columns.length === 0) {
      return NextResponse.json(
        { error: "Could not retrieve schema information or no tables found in the 'public' schema." },
        { status: 404 },
      )
    }

    const schema = columns.reduce(
      (acc, col) => {
        const tableName = col.table_name
        if (!acc[tableName]) {
          acc[tableName] = []
        }
        acc[tableName].push({
          column: col.column_name,
          position: col.ordinal_position,
          type: col.data_type,
          nullable: col.is_nullable,
          default: col.column_default,
        })
        return acc
      },
      {} as Record<string, any[]>,
    )

    return NextResponse.json(schema)
  } catch (error) {
    console.error("[API /diagnostics/schema] Failed to fetch database schema:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"

    if (
      errorMessage.includes("Database connection string not configured") ||
      errorMessage.includes("Could not initialize database connection") ||
      errorMessage.includes("Failed to initialize Neon SQL client")
    ) {
      return NextResponse.json(
        {
          error: "Database Connection Error",
          details: `The API route could not connect to the database. Please check server logs and environment variables. Original error: ${errorMessage}`,
        },
        { status: 503 },
      )
    }

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: `An error occurred while fetching the schema: ${errorMessage}`,
      },
      { status: 500 },
    )
  }
}
