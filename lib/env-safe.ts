/**
 * Environment Variable Safe Access
 *
 * This utility provides safe access to environment variables,
 * handling the differences between server and client components.
 */

// Type for environment variable configuration
type EnvVarConfig = {
  name: string
  defaultValue?: string
  isRequired?: boolean
  isClientSafe?: boolean
}

// Cache for environment variables
const envCache = new Map<string, string>()

/**
 * Safely get an environment variable, respecting client/server context
 * @param name The name of the environment variable
 * @param defaultValue Optional default value if not found
 * @param isRequired Whether the variable is required
 * @param isClientSafe Whether the variable can be accessed on the client
 * @returns The environment variable value or default
 */
export function getEnvSafe({
  name,
  defaultValue = "",
  isRequired = false,
  isClientSafe = false,
}: EnvVarConfig): string {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== "undefined"

  // If we're in the browser and the variable isn't client-safe, return default or empty
  if (isBrowser && !isClientSafe) {
    return defaultValue
  }

  // Check cache first
  if (envCache.has(name)) {
    return envCache.get(name) || defaultValue
  }

  // Get the value from process.env
  let value = process.env[name] || ""

  // For client-safe variables, check for NEXT_PUBLIC_ prefix
  if (isBrowser && !name.startsWith("NEXT_PUBLIC_")) {
    value = process.env[`NEXT_PUBLIC_${name}`] || ""
  }

  // If not found and required, throw error (only on server)
  if (!value && isRequired && !isBrowser) {
    throw new Error(`Required environment variable ${name} is not set`)
  }

  // Use default if not found
  const result = value || defaultValue

  // Cache the result
  envCache.set(name, result)

  return result
}

/**
 * Get database URL safely
 * @returns The database URL
 */
export function getDatabaseUrl(): string {
  return getEnvSafe({
    name: "production_DATABASE_URL",
    defaultValue: getEnvSafe({ name: "DATABASE_URL", isRequired: true }),
  })
}

/**
 * Get Redis URL safely
 * @returns The Redis URL
 */
export function getRedisUrl(): string {
  return getEnvSafe({
    name: "KV_URL",
    defaultValue: getEnvSafe({ name: "REDIS_URL" }),
  })
}

/**
 * Get Redis token safely
 * @returns The Redis token
 */
export function getRedisToken(): string {
  return getEnvSafe({
    name: "KV_REST_API_TOKEN",
    defaultValue: getEnvSafe({ name: "REDIS_TOKEN" }),
  })
}

/**
 * Get Blob token safely
 * @returns The Blob token
 */
export function getBlobToken(): string {
  return getEnvSafe({
    name: "BLOB_READ_WRITE_TOKEN",
    isRequired: true,
  })
}

/**
 * Get Groq API key safely
 * @returns The Groq API key
 */
export function getGroqApiKey(): string {
  return getEnvSafe({
    name: "GROQ_API_KEY",
    isRequired: true,
  })
}

/**
 * Get tenant ID safely
 * @returns The tenant ID
 */
export function getTenantId(): string {
  return getEnvSafe({
    name: "DEFAULT_TENANT_ID",
    defaultValue: "ba367cfe-6de0-4180-9566-1002b75cf82c",
    isClientSafe: true,
  })
}

export default {
  getEnvSafe,
  getDatabaseUrl,
  getRedisUrl,
  getRedisToken,
  getBlobToken,
  getGroqApiKey,
  getTenantId,
}
