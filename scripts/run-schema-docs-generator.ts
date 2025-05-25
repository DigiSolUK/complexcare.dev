import { exec } from "child_process"
import path from "path"

// Path to the generator script
const generatorPath = path.join(process.cwd(), "scripts", "generate-schema-docs.ts")

// Execute the generator script
console.log("Running schema documentation generator...")
exec(`ts-node ${generatorPath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`)
    return
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`)
    return
  }
  console.log(stdout)
  console.log("Schema documentation generated successfully!")
})
