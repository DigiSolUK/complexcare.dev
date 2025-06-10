/**
 * This file is a shim to satisfy imports that may be looking for a db-connection-fix file.
 * It points to the centralized `lib/db.ts` exports.
 */
import { getNeonSqlClient } from "@/lib/db"

export const getSqlClient = getNeonSqlClient

export function getDatabaseUrl(): string | undefined {
  const possibleEnvVars = [
    "DATABASE_URL",
    "POSTGRES_URL",
    "production_DATABASE_URL",
    "production_POSTGRES_URL",
    "DATABASE_URL_UNPOOLED",
    "POSTGRES_URL_NON_POOLING",
    "production_DATABASE_URL_UNPOOLED",
    "production_POSTGRES_URL_NON_POOLING",
    "AUTH_DATABASE_URL",
  ]
  for (const envVar of possibleEnvVars) {
    if (process.env[envVar] && process.env[envVar]!.trim() !== "") {
      return process.env[envVar]!
    }
  }
  return undefined
}
