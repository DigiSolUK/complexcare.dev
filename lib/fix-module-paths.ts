/**
 * Module Path Fixer
 *
 * This utility helps resolve module path issues by providing a compatibility layer
 * for different import patterns used in the application.
 */

// Map of old import paths to new ones
const MODULE_PATH_MAP: Record<string, string> = {
  "@v0/lib/data": "@/lib/db",
  "@v0/components": "@/components",
  "@v0/utils": "@/lib/utils",
  "@v0/hooks": "@/hooks",
  "@v0/types": "@/types",
  "@v0/services": "@/lib/services",
  "@v0/constants": "@/lib/constants",
  "@v0/api": "@/lib/api-utils",
}

/**
 * This function is used to dynamically import modules with compatibility for old paths
 * @param modulePath The original module path
 * @returns The module
 */
export async function compatImport(modulePath: string): Promise<any> {
  // Check if the path needs to be remapped
  const mappedPath = MODULE_PATH_MAP[modulePath] || modulePath

  try {
    // Try to import with the new path
    return await import(mappedPath)
  } catch (error) {
    console.error(`Failed to import module: ${mappedPath}`, error)
    throw error
  }
}

/**
 * This function checks if a module path exists and returns the correct path
 * @param modulePath The original module path
 * @returns The correct module path
 */
export function resolveModulePath(modulePath: string): string {
  return MODULE_PATH_MAP[modulePath] || modulePath
}

export default {
  compatImport,
  resolveModulePath,
}
