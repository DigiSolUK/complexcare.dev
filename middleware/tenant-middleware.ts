import { type NextRequest, NextResponse } from "next/server"
import { getTenantFromRequest } from "@/lib/tenant-utils"

export async function tenantMiddleware(request: NextRequest) {
  // Get the current path
  const { pathname } = request.nextUrl

  // Skip tenant middleware for auth routes and public routes
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/error" ||
    pathname.includes("favicon.ico")
  ) {
    return NextResponse.next()
  }

  // Get tenant from request (subdomain, header, or cookie)
  const tenant = await getTenantFromRequest(request)

  // If no tenant is found and this is a protected route, redirect to error page
  if (!tenant && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/error?code=no_tenant", request.url))
  }

  // Add tenant information to request headers for use in API routes
  const requestHeaders = new Headers(request.headers)
  if (tenant) {
    requestHeaders.set("x-tenant-id", tenant.id)
  }

  // Continue with modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

