import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Default tenant ID defined here for middleware usage
const DEFAULT_TENANT_ID = "ba367cfe-6de0-4180-9566-1002b75cf82c"

export function middleware(request: NextRequest) {
  // Add tenant ID header to all requests
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-tenant-id", DEFAULT_TENANT_ID)

  // Always allow access by returning NextResponse.next()
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

// Limit middleware to specific paths to avoid conflicts
export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico|public/).*)"],
}
