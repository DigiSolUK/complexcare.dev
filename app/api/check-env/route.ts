import { NextResponse } from "next/server"

export async function GET() {
  const envVars = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    POSTGRES_URL: !!process.env.POSTGRES_URL,
    production_DATABASE_URL: !!process.env.production_DATABASE_URL,
    production_POSTGRES_URL: !!process.env.production_POSTGRES_URL,
    AUTH_DATABASE_URL: !!process.env.AUTH_DATABASE_URL,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
    DEFAULT_TENANT_ID: process.env.DEFAULT_TENANT_ID || "ba367cfe-6de0-4180-9566-1002b75cf82c",
  }

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    variables: envVars,
  })
}
