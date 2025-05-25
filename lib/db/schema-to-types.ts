import { fetchDatabaseSchema } from "./schema-validator"

/**
 * Converts PostgreSQL types to TypeScript types
 */
function pgTypeToTsType(pgType: string, nullable: boolean): string {
  // Normalize the type
  pgType = pgType.toLowerCase()

  let tsType = "any"

  if (pgType.includes("char") || pgType.includes("text")) {
    tsType = "string"
  } else if (
    pgType.includes("int") ||
    pgType.includes("float") ||
    pgType.includes("numeric") ||
    pgType.includes("decimal")
  ) {
    tsType = "number"
  } else if (pgType === "boolean") {
    tsType = "boolean"
  } else if (pgType.includes("timestamp") || pgType.includes("date")) {
    tsType = "Date"
  } else if (pgType.includes("json")) {
    tsType = "Record<string, any>"
  } else if (pgType === "uuid") {
    tsType = "string"
  } else if (pgType.includes("[]")) {
    // Array type
    const baseType = pgType.replace("[]", "")
    tsType = `${pgTypeToTsType(baseType, false)}[]`
  }

  return nullable ? `${tsType} | null` : tsType
}

/**
 * Converts a table name to a TypeScript interface name
 */
function tableNameToInterfaceName(tableName: string): string {
  return tableName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")
}

/**
 * Generates TypeScript interfaces from database schema
 */
export async function generateTypeDefinitions(): Promise<string> {
  const schema = await fetchDatabaseSchema()
  let output = "// Auto-generated TypeScript interfaces from database schema\n\n"

  for (const table of schema) {
    const interfaceName = tableNameToInterfaceName(table.name)

    output += `export interface ${interfaceName} {\n`

    for (const column of table.columns) {
      const tsType = pgTypeToTsType(column.type, column.nullable)
      const description = column.description ? ` // ${column.description}` : ""

      output += `  ${column.name}${column.nullable ? "?" : ""}: ${tsType};${description}\n`
    }

    output += "}\n\n"
  }

  return output
}

/**
 * Generates a TypeScript file with interfaces from the database schema
 */
export async function generateTypeDefinitionsFile(outputPath: string): Promise<void> {
  const fs = require("fs")
  const path = require("path")

  try {
    const typeDefinitions = await generateTypeDefinitions()

    // Ensure directory exists
    const dir = path.dirname(outputPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // Write the file
    fs.writeFileSync(outputPath, typeDefinitions)

    console.log(`Type definitions written to ${outputPath}`)
  } catch (error) {
    console.error("Error generating type definitions:", error)
    throw error
  }
}
