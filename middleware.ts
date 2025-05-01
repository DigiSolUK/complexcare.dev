import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { rateLimiter } from "./lib/redis/rate-limiter"

// Default tenant ID defined here for middleware usage
const DEFAULT_TENANT_ID = "ba367cfe-6de0-4180-9566-1002b75cf82c"

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname

  // Allow access to public API endpoints without authentication
  if (pathname.startsWith("/api/public/")) {
    return NextResponse.next()
  }

  // Allow access to superadmin routes without authentication
  if (pathname.startsWith("/superadmin") || pathname.startsWith("/api/superadmin")) {
    return NextResponse.next()
  }

  // Apply rate limiting to API routes
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/public/")) {
    const rateLimit = await rateLimiter(request)

    // If rate limit response is a NextResponse, return it
    if (rateLimit instanceof NextResponse) {
      return rateLimit
    }

    // Otherwise, it's headers to add to the response
    const requestHeaders = new Headers(request.headers)
    rateLimit.forEach((value, key) => {
      requestHeaders.set(key, value)
    })

    // Add tenant ID header
    requestHeaders.set("x-tenant-id", DEFAULT_TENANT_ID)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // In demo mode, allow all requests but ensure default tenant ID is available
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-tenant-id", DEFAULT_TENANT_ID)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
