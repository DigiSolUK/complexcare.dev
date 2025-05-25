import { generateTypeDefinitionsFile } from "../lib/db/schema-to-types"

async function main() {
  try {
    await generateTypeDefinitionsFile("./types/db-schema.ts")
    console.log("Successfully generated TypeScript types from database schema")
  } catch (error) {
    console.error("Failed to generate types:", error)
    process.exit(1)
  }
}

main()
