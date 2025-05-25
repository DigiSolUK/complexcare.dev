import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Default tenant ID defined here for middleware usage
const DEFAULT_TENANT_ID = "ba367cfe-6de0-4180-9566-1002b75cf82c"

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname

  // EMERGENCY RECOVERY MODE
  // Check if this is an emergency recovery request
  const isEmergencyMode = request.nextUrl.searchParams.has("safe_mode")
  if (isEmergencyMode) {
    // Allow the request to proceed without any middleware processing
    return NextResponse.next()
  }

  // Check if this is the emergency recovery API endpoint
  if (pathname.startsWith("/api/emergency-recovery")) {
    return NextResponse.next()
  }

  // Allow access to public API endpoints without authentication
  if (pathname.startsWith("/api/public/")) {
    return NextResponse.next()
  }

  // Allow access to superadmin routes without authentication
  if (pathname.startsWith("/superadmin") || pathname.startsWith("/api/superadmin")) {
    return NextResponse.next()
  }

  // Allow access to system diagnostics
  if (pathname.startsWith("/diagnostics") || pathname.startsWith("/api/diagnostics")) {
    return NextResponse.next()
  }

  try {
    // Add tenant ID header to all requests
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-tenant-id", DEFAULT_TENANT_ID)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    // If middleware fails, allow the request to proceed anyway
    // This prevents middleware from completely breaking the application
    console.error("Middleware error:", error)
    return NextResponse.next()
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
