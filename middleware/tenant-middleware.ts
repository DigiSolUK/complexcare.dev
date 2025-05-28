import { type NextRequest, NextResponse } from "next/server"
import { getTenantFromRequest } from "@/lib/tenant-utils"

export async function tenantMiddleware(request: NextRequest) {
  // Get the current path
  const { pathname } = request.nextUrl

  // Skip tenant middleware for certain paths
  if (pathname.startsWith("/_next") || pathname.includes("favicon.ico")) {
    return NextResponse.next()
  }

  // Get tenant from request (subdomain, header, or cookie)
  // If no tenant is found, use the default tenant
  const tenant = (await getTenantFromRequest(request)) || {
    id: process.env.DEFAULT_TENANT_ID || "ba367cfe-6de0-4180-9566-1002b75cf82c",
  }

  // Add tenant information to request headers for use in API routes
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-tenant-id", tenant.id)

  // Continue with modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}
