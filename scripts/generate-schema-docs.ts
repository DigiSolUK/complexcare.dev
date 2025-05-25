import { neon } from "@neondatabase/serverless"
import fs from "fs"
import path from "path"

// Define the output file path
const outputPath = path.join(process.cwd(), "docs", "database-schema.md")

// Create a SQL client using the DATABASE_URL environment variable
const sql = neon(process.env.DATABASE_URL || "")

async function generateSchemaDocs() {
  try {
    console.log("Connecting to database...")

    // Get all tables in the public schema
    const tables = await sql`
      SELECT 
        table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `

    console.log(`Found ${tables.length} tables`)

    // Start building the markdown content
    let markdown = `# ComplexCare CRM Database Schema Documentation\n\n`
    markdown += `*Generated automatically on ${new Date().toISOString().split("T")[0]}*\n\n`
    markdown += `## Overview\n\n`
    markdown += `The ComplexCare CRM system uses a PostgreSQL database hosted on Neon. `
    markdown += `This document provides a comprehensive overview of the database schema, including tables, relationships, and usage patterns.\n\n`

    markdown += `## Tables\n\n`

    // Process each table
    for (const table of tables) {
      const tableName = table.table_name
      console.log(`Processing table: ${tableName}`)

      // Get table description if available
      const tableDescription = await sql`
        SELECT obj_description(c.oid) as description
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = ${tableName}
        AND n.nspname = 'public'
      `

      // Get columns for this table
      const columns = await sql`
        SELECT 
          column_name,
          data_type,
          character_maximum_length,
          column_default,
          is_nullable,
          col_description(
            (SELECT oid FROM pg_class WHERE relname = ${tableName}),
            ordinal_position
          ) as description
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = ${tableName}
        ORDER BY ordinal_position
      `

      // Get primary key
      const primaryKey = await sql`
        SELECT 
          c.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.constraint_column_usage AS c
          ON c.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'PRIMARY KEY'
        AND tc.table_schema = 'public'
        AND tc.table_name = ${tableName}
      `

      // Get foreign keys
      const foreignKeys = await sql`
        SELECT
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
        AND tc.table_name = ${tableName}
      `

      // Get indexes
      const indexes = await sql`
        SELECT
          i.relname as index_name,
          a.attname as column_name,
          ix.indisunique as is_unique
        FROM
          pg_class t,
          pg_class i,
          pg_index ix,
          pg_attribute a
        WHERE
          t.oid = ix.indrelid
          AND i.oid = ix.indexrelid
          AND a.attrelid = t.oid
          AND a.attnum = ANY(ix.indkey)
          AND t.relkind = 'r'
          AND t.relname = ${tableName}
        ORDER BY
          i.relname
      `

      // Add table header
      markdown += `### ${tableName}\n\n`

      // Add table description if available
      if (tableDescription.length > 0 && tableDescription[0].description) {
        markdown += `${tableDescription[0].description}\n\n`
      }

      // Add columns table
      markdown += `| Column | Type | Nullable | Default | Description |\n`
      markdown += `|--------|------|----------|---------|-------------|\n`

      for (const column of columns) {
        // Format the data type with length if applicable
        let dataType = column.data_type
        if (column.character_maximum_length) {
          dataType += `(${column.character_maximum_length})`
        }

        // Check if this column is a primary key
        const isPrimaryKey = primaryKey.some((pk) => pk.column_name === column.column_name)
        if (isPrimaryKey) {
          dataType += " PRIMARY KEY"
        }

        // Check if this column is a foreign key
        const foreignKey = foreignKeys.find((fk) => fk.column_name === column.column_name)
        if (foreignKey) {
          dataType += ` REFERENCES ${foreignKey.foreign_table_name}(${foreignKey.foreign_column_name})`
        }

        markdown += `| ${column.column_name} | ${dataType} | ${column.is_nullable} | ${column.column_default || ""} | ${column.description || ""} |\n`
      }

      markdown += `\n`

      // Add indexes section if there are any
      if (indexes.length > 0) {
        markdown += `#### Indexes\n\n`
        markdown += `| Name | Columns | Unique |\n`
        markdown += `|------|---------|--------|\n`

        // Group indexes by name
        const indexMap = new Map()
        for (const index of indexes) {
          if (!indexMap.has(index.index_name)) {
            indexMap.set(index.index_name, {
              name: index.index_name,
              columns: [index.column_name],
              isUnique: index.is_unique,
            })
          } else {
            indexMap.get(index.index_name).columns.push(index.column_name)
          }
        }

        // Add each index to the markdown
        for (const [_, index] of indexMap) {
          markdown += `| ${index.name} | ${index.columns.join(", ")} | ${index.isUnique ? "Yes" : "No"} |\n`
        }

        markdown += `\n`
      }

      // Add sample queries section
      markdown += `#### Sample Queries\n\n`
      markdown += "```sql\n"
      markdown += `-- Select all from ${tableName}\n`
      markdown += `SELECT * FROM ${tableName}\n`
      markdown += `WHERE tenant_id = '${tableName === "tenants" ? "tenant_id" : "${tenantId}"}'`

      // Add additional conditions for common tables
      if (tableName === "patients" || tableName === "care_professionals") {
        markdown += `\nAND is_active = true`
      }
      if (tableName !== "tenants" && columns.some((c) => c.column_name === "deleted_at")) {
        markdown += `\nAND deleted_at IS NULL`
      }

      markdown += `;\n`

      // Add insert example
      markdown += `\n-- Insert into ${tableName}\n`
      markdown += `INSERT INTO ${tableName} (\n  `

      // Get required columns (excluding auto-generated ones)
      const insertableColumns = columns
        .filter(
          (c) =>
            c.column_name !== "id" &&
            c.column_name !== "created_at" &&
            c.column_name !== "updated_at" &&
            !c.column_default?.includes("gen_random_uuid()"),
        )
        .map((c) => c.column_name)

      markdown += insertableColumns.join(",\n  ")
      markdown += `\n) VALUES (\n  `
      markdown += insertableColumns.map((_, i) => `$${i + 1}`).join(",\n  ")
      markdown += `\n);\n`

      // Add update example
      markdown += `\n-- Update ${tableName}\n`
      markdown += `UPDATE ${tableName}\nSET\n  `
      markdown += insertableColumns
        .filter((c) => c !== "tenant_id") // Don't update tenant_id
        .map((col, i) => `${col} = $${i + 2}`)
        .join(",\n  ")
      markdown += `\nWHERE id = $1`
      if (tableName !== "tenants") {
        markdown += `\nAND tenant_id = '${tableName === "tenants" ? "tenant_id" : "${tenantId}"}'`
      }
      markdown += `;\n`

      markdown += "```\n\n"
    }

    // Add entity relationship diagram section
    markdown += `## Entity Relationship Diagram\n\n`
    markdown += `Below is a simplified entity-relationship diagram showing the main tables and their relationships:\n\n`

    // Generate mermaid diagram
    markdown += "```mermaid\n"
    markdown += "erDiagram\n"

    // Add entities
    for (const table of tables) {
      markdown += `    ${table.table_name.toUpperCase()} {\n`

      // Get columns for this table
      const columns = await sql`
        SELECT 
          column_name,
          data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = ${table.table_name}
        ORDER BY ordinal_position
        LIMIT 5
      `

      // Add a few sample columns
      for (const column of columns) {
        markdown += `        ${column.data_type} ${column.column_name}\n`
      }

      markdown += `    }\n`
    }

    // Add relationships based on foreign keys
    for (const table of tables) {
      const foreignKeys = await sql`
        SELECT
          tc.table_name,
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
        AND tc.table_name = ${table.table_name}
      `

      for (const fk of foreignKeys) {
        // Skip self-referencing foreign keys to keep the diagram cleaner
        if (fk.table_name === fk.foreign_table_name) continue

        markdown += `    ${fk.foreign_table_name.toUpperCase()} ||--o{ ${fk.table_name.toUpperCase()} : "has"\n`
      }
    }

    markdown += "```\n\n"

    // Add best practices section
    markdown += `## Best Practices\n\n`
    markdown += `### Working with the Database\n\n`
    markdown += `1. **Always Include Tenant ID**: Every query should include the tenant_id to maintain data isolation\n`
    markdown += `2. **Use Parameterized Queries**: Always use parameterized queries to prevent SQL injection\n`
    markdown += `3. **Soft Deletion**: Use soft deletion (setting deleted_at) rather than DELETE statements\n`
    markdown += `4. **Transactions**: Use transactions for operations that modify multiple tables\n`
    markdown += `5. **Limit Result Sets**: Always limit the number of rows returned to prevent performance issues\n`
    markdown += `6. **Include Created/Updated By**: Set created_by and updated_by fields to maintain audit trails\n`
    markdown += `7. **Check Permissions**: Verify user permissions before executing database operations\n`
    markdown += `8. **Handle NULL Values**: Always handle NULL values appropriately in queries and application code\n`

    // Write the markdown to the output file
    fs.writeFileSync(outputPath, markdown)

    console.log(`Schema documentation generated successfully at ${outputPath}`)
  } catch (error) {
    console.error("Error generating schema documentation:", error)
  }
}

// Run the function
generateSchemaDocs()
