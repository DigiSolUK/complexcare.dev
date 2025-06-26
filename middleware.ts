import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Since authentication is not configured, we simply allow all requests to pass through.
  // In a real application, you would implement authentication logic here
  // to protect routes and ensure only authorized users can access certain paths.
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth (auth routes)
     * - api/public (public API routes)
     * - / (marketing landing page)
     * - /login (login page)
     * - /live-login (live login page)
     * - /unauthorized (unauthorized page)
     * - /error (error page)
     * - /debug (debug page)
     * - /api/config/stack-auth (Stack Auth config)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/auth|api/public|api/config/stack-auth|login|live-login|unauthorized|error|debug|$).*)",
  ],
}
