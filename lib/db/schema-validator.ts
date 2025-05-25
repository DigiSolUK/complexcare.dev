import { neon } from "@neondatabase/serverless"
import { validations } from "@/lib/validations/schemas"

export interface SchemaValidationResult {
  isValid: boolean
  mismatches: SchemaMismatch[]
  timestamp: string
}

export interface SchemaMismatch {
  type: "missing_table" | "missing_column" | "type_mismatch" | "constraint_mismatch"
  entity: string
  expected: string
  actual: string | null
  severity: "error" | "warning"
  suggestion: string
}

export interface TableDefinition {
  name: string
  columns: ColumnDefinition[]
  constraints: ConstraintDefinition[]
}

export interface ColumnDefinition {
  name: string
  type: string
  nullable: boolean
  defaultValue?: string
  description?: string
}

export interface ConstraintDefinition {
  name: string
  type: "primary_key" | "foreign_key" | "unique" | "check"
  columns: string[]
  referencedTable?: string
  referencedColumns?: string[]
}

// Map Zod types to PostgreSQL types
const zodToPostgresTypeMap = new Map<string, string>([
  ["ZodString", "character varying"],
  ["ZodNumber", "numeric"],
  ["ZodBoolean", "boolean"],
  ["ZodDate", "timestamp with time zone"],
  ["ZodArray", "jsonb"],
  ["ZodObject", "jsonb"],
  ["ZodEnum", "character varying"],
  ["ZodUuid", "uuid"],
])

/**
 * Extracts expected schema from Zod validation schemas
 */
export function extractExpectedSchemaFromZod(): TableDefinition[] {
  const tables: TableDefinition[] = []

  // Process each validation schema
  Object.entries(validations).forEach(([schemaName, schema]) => {
    if (!schema || typeof schema !== "object" || !("shape" in schema)) {
      return
    }

    // Convert schema name to table name (e.g., userSchema -> users)
    const tableName = schemaName.replace(/Schema$/, "s").toLowerCase()

    const columns: ColumnDefinition[] = []
    const constraints: ConstraintDefinition[] = []

    // Add primary key constraint
    constraints.push({
      name: `${tableName}_pkey`,
      type: "primary_key",
      columns: ["id"],
    })

    // Process each field in the schema
    Object.entries(schema.shape).forEach(([fieldName, fieldSchema]) => {
      // Skip if not a valid field schema
      if (!fieldSchema || typeof fieldSchema !== "object") {
        return
      }

      // Determine PostgreSQL type from Zod type
      const zodTypeName = fieldSchema.constructor.name
      const pgType = zodToPostgresTypeMap.get(zodTypeName) || "text"

      // Determine nullability
      const isOptional = "isOptional" in fieldSchema && fieldSchema.isOptional === true

      columns.push({
        name: fieldName,
        type: pgType,
        nullable: isOptional,
        description: `Field from ${schemaName}`,
      })

      // Check for foreign key references (fields ending with _id)
      if (fieldName.endsWith("_id") && fieldName !== "id") {
        const referencedTable = fieldName.replace(/_id$/, "s")
        constraints.push({
          name: `${tableName}_${fieldName}_fkey`,
          type: "foreign_key",
          columns: [fieldName],
          referencedTable,
          referencedColumns: ["id"],
        })
      }
    })

    tables.push({
      name: tableName,
      columns,
      constraints,
    })
  })

  return tables
}

/**
 * Fetches the actual database schema
 */
export async function fetchDatabaseSchema(): Promise<TableDefinition[]> {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const tables: TableDefinition[] = []

    // Get all tables
    const tableResult = await sql`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public'
    `

    for (const tableRow of tableResult) {
      const tableName = tableRow.tablename

      // Get columns for this table
      const columnResult = await sql`
        SELECT 
          column_name, 
          data_type, 
          is_nullable, 
          column_default,
          col_description(
            (table_schema || '.' || table_name)::regclass::oid, 
            ordinal_position
          ) as description
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = ${tableName}
        ORDER BY ordinal_position
      `

      const columns: ColumnDefinition[] = columnResult.map((col) => ({
        name: col.column_name,
        type: col.data_type,
        nullable: col.is_nullable === "YES",
        defaultValue: col.column_default,
        description: col.description,
      }))

      // Get constraints for this table
      const constraintResult = await sql`
        SELECT
          con.conname as constraint_name,
          con.contype as constraint_type,
          array_agg(col.attname) as columns,
          CASE 
            WHEN con.contype = 'f' THEN obj_description(con.confrelid, 'pg_class')
            ELSE NULL
          END as referenced_table,
          CASE 
            WHEN con.contype = 'f' THEN 
              (SELECT array_agg(attname) 
               FROM pg_attribute 
               WHERE attrelid = con.confrelid AND attnum = ANY(con.confkey))
            ELSE NULL
          END as referenced_columns
        FROM pg_constraint con
        JOIN pg_class rel ON rel.oid = con.conrelid
        JOIN pg_attribute col ON col.attrelid = con.conrelid AND col.attnum = ANY(con.conkey)
        WHERE rel.relname = ${tableName}
        GROUP BY con.conname, con.contype, con.confrelid
      `

      const constraints: ConstraintDefinition[] = constraintResult.map((con) => {
        const constraintType =
          con.constraint_type === "p"
            ? "primary_key"
            : con.constraint_type === "f"
              ? "foreign_key"
              : con.constraint_type === "u"
                ? "unique"
                : "check"

        return {
          name: con.constraint_name,
          type: constraintType,
          columns: con.columns,
          referencedTable: con.referenced_table,
          referencedColumns: con.referenced_columns,
        }
      })

      tables.push({
        name: tableName,
        columns,
        constraints,
      })
    }

    return tables
  } catch (error) {
    console.error("Error fetching database schema:", error)
    throw new Error(`Failed to fetch database schema: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Compares expected schema with actual database schema
 */
export function compareSchemas(expectedSchema: TableDefinition[], actualSchema: TableDefinition[]): SchemaMismatch[] {
  const mismatches: SchemaMismatch[] = []

  // Create maps for easier lookup
  const actualTablesMap = new Map(actualSchema.map((table) => [table.name, table]))

  // Check for missing tables and column mismatches
  for (const expectedTable of expectedSchema) {
    const actualTable = actualTablesMap.get(expectedTable.name)

    if (!actualTable) {
      mismatches.push({
        type: "missing_table",
        entity: expectedTable.name,
        expected: `Table ${expectedTable.name} with ${expectedTable.columns.length} columns`,
        actual: null,
        severity: "error",
        suggestion: `Create table ${expectedTable.name} with the required columns`,
      })
      continue
    }

    // Create maps for columns
    const actualColumnsMap = new Map(actualTable.columns.map((col) => [col.name, col]))

    // Check for missing or mismatched columns
    for (const expectedColumn of expectedTable.columns) {
      const actualColumn = actualColumnsMap.get(expectedColumn.name)

      if (!actualColumn) {
        mismatches.push({
          type: "missing_column",
          entity: `${expectedTable.name}.${expectedColumn.name}`,
          expected: `Column ${expectedColumn.name} of type ${expectedColumn.type}`,
          actual: null,
          severity: "error",
          suggestion: `Add column ${expectedColumn.name} to table ${expectedTable.name}`,
        })
        continue
      }

      // Check for type mismatches
      if (!isTypeCompatible(expectedColumn.type, actualColumn.type)) {
        mismatches.push({
          type: "type_mismatch",
          entity: `${expectedTable.name}.${expectedColumn.name}`,
          expected: expectedColumn.type,
          actual: actualColumn.type,
          severity: "error",
          suggestion: `Alter column ${expectedColumn.name} in table ${expectedTable.name} to type ${expectedColumn.type}`,
        })
      }

      // Check for nullability mismatches
      if (expectedColumn.nullable !== actualColumn.nullable) {
        mismatches.push({
          type: "constraint_mismatch",
          entity: `${expectedTable.name}.${expectedColumn.name}`,
          expected: expectedColumn.nullable ? "NULL allowed" : "NOT NULL",
          actual: actualColumn.nullable ? "NULL allowed" : "NOT NULL",
          severity: "warning",
          suggestion: `Alter column ${expectedColumn.name} in table ${expectedTable.name} to ${expectedColumn.nullable ? "allow" : "disallow"} NULL values`,
        })
      }
    }

    // Check constraints (simplified for now)
    // A more comprehensive check would compare primary keys, foreign keys, etc.
  }

  return mismatches
}

/**
 * Checks if two database types are compatible
 */
function isTypeCompatible(expectedType: string, actualType: string): boolean {
  // Normalize types for comparison
  const normalizedExpected = normalizeType(expectedType)
  const normalizedActual = normalizeType(actualType)

  return normalizedExpected === normalizedActual
}

/**
 * Normalizes database type names for comparison
 */
function normalizeType(type: string): string {
  // Handle common type variations
  type = type.toLowerCase()

  if (type.includes("char") || type.includes("text") || type.includes("varchar")) {
    return "string"
  }

  if (type.includes("int") || type.includes("numeric") || type.includes("decimal") || type.includes("float")) {
    return "number"
  }

  if (type.includes("bool")) {
    return "boolean"
  }

  if (type.includes("timestamp") || type.includes("date") || type.includes("time")) {
    return "date"
  }

  if (type.includes("json")) {
    return "json"
  }

  if (type.includes("uuid")) {
    return "uuid"
  }

  return type
}

/**
 * Validates the database schema against expected schema
 */
export async function validateDatabaseSchema(): Promise<SchemaValidationResult> {
  try {
    const expectedSchema = extractExpectedSchemaFromZod()
    const actualSchema = await fetchDatabaseSchema()
    const mismatches = compareSchemas(expectedSchema, actualSchema)

    return {
      isValid: mismatches.length === 0,
      mismatches,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Schema validation failed:", error)
    return {
      isValid: false,
      mismatches: [
        {
          type: "missing_table",
          entity: "schema_validation",
          expected: "Valid database connection and schema",
          actual: error instanceof Error ? error.message : String(error),
          severity: "error",
          suggestion: "Check database connection and permissions",
        },
      ],
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * Generates SQL to fix schema mismatches
 */
export function generateFixSql(mismatches: SchemaMismatch[]): string {
  let sql = ""

  for (const mismatch of mismatches) {
    switch (mismatch.type) {
      case "missing_table":
        // This is simplified - a real implementation would generate proper CREATE TABLE statements
        sql += `-- Create missing table: ${mismatch.entity}\n`
        sql += `-- ${mismatch.suggestion}\n\n`
        break

      case "missing_column":
        const [tableName, columnName] = mismatch.entity.split(".")
        sql += `-- Add missing column: ${mismatch.entity}\n`
        sql += `ALTER TABLE ${tableName} ADD COLUMN ${columnName} TEXT;\n\n`
        break

      case "type_mismatch":
        const [tableWithTypeMismatch, columnWithTypeMismatch] = mismatch.entity.split(".")
        sql += `-- Fix type mismatch: ${mismatch.entity}\n`
        sql += `ALTER TABLE ${tableWithTypeMismatch} ALTER COLUMN ${columnWithTypeMismatch} TYPE ${mismatch.expected} USING ${columnWithTypeMismatch}::${mismatch.expected};\n\n`
        break

      case "constraint_mismatch":
        const [tableWithConstraintMismatch, columnWithConstraintMismatch] = mismatch.entity.split(".")
        if (mismatch.expected.includes("NOT NULL")) {
          sql += `-- Add NOT NULL constraint: ${mismatch.entity}\n`
          sql += `ALTER TABLE ${tableWithConstraintMismatch} ALTER COLUMN ${columnWithConstraintMismatch} SET NOT NULL;\n\n`
        } else {
          sql += `-- Remove NOT NULL constraint: ${mismatch.entity}\n`
          sql += `ALTER TABLE ${tableWithConstraintMismatch} ALTER COLUMN ${columnWithConstraintMismatch} DROP NOT NULL;\n\n`
        }
        break
    }
  }

  return sql
}
