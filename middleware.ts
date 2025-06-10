import { auth } from "@/lib/auth/stack-auth-server"
import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  return auth(request, (auth) => {
    if (!auth.session) {
      return NextResponse.redirect(new URL("/api/auth/signin?callbackUrl=" + request.nextUrl.pathname, request.url))
    }
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
