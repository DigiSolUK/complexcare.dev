import { config } from "dotenv"
config()
import { neon } from "@neondatabase/serverless"
import fs from "fs"

async function scanDatabase() {
  try {
    const sql = neon(process.env.DATABASE_URL)

    // Fetch all table names
    const tableResult = await sql`
      SELECT tablename
      FROM pg_catalog.pg_tables
      WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';
    `
    const tableNames = tableResult.map((row) => row.tablename)

    let markdownContent = `# Project Status: Database Schema\n\n`
    markdownContent += `This document provides a comprehensive overview of the database schema for the ComplexCareCRM project.\n\n`

    for (const tableName of tableNames) {
      markdownContent += `## Table: ${tableName}\n\n`

      // Fetch column details for the current table
      const columnResult = await sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = ${tableName};
      `

      markdownContent += `| Column Name | Data Type | Nullable | Default Value |\n`
      markdownContent += `| ----------- | --------- | -------- | ------------- |\n`

      for (const column of columnResult) {
        markdownContent += `| ${column.column_name} | ${column.data_type} | ${column.is_nullable} | ${column.column_default || ""} |\n`
      }

      markdownContent += `\n`
    }

    // Write the markdown content to a file
    fs.writeFileSync("project_status.md", markdownContent)
    console.log("Database schema scan completed. Results written to project_status.md")
  } catch (error) {
    console.error("Error scanning database:", error)
  }
}

scanDatabase()
