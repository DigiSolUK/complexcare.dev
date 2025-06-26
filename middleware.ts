import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { DEFAULT_TENANT_ID } from "@/lib/tenant-utils"
import { isValidUUID } from "@/lib/db-utils"

export async function middleware(request: NextRequest) {
  const token = request.nextauth.token

  // If there's no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Ensure tenantId is a valid UUID, falling back if necessary
  const tenantId =
    token.tenantId && isValidUUID(token.tenantId as string) ? (token.tenantId as string) : DEFAULT_TENANT_ID

  // Attach tenantId to the request headers for API routes
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-tenant-id", tenantId)

  // Allow access to API routes if authenticated
  if (request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // Allow access to dashboard routes if authenticated
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // Allow access to superadmin routes if authenticated and role is superadmin
  if (request.nextUrl.pathname.startsWith("/superadmin")) {
    if (token.role !== "superadmin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // Allow access to specific public routes
  if (
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/unauthorized") ||
    request.nextUrl.pathname.startsWith("/error") ||
    request.nextUrl.pathname.startsWith("/api/public") ||
    request.nextUrl.pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next()
  }

  // For all other routes, if authenticated, proceed
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (e.g. /public/images)
     * - api/auth (auth routes)
     * - api/public (public API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|api/auth|api/public).*)",
  ],
}
