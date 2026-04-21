import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // Check if the request is for the admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow admin-login page without authentication
    if (request.nextUrl.pathname.startsWith('/admin-login')) {
      return NextResponse.next()
    }
    
    // Check for the admin password cookie
    const adminPassword = "P@ssw0rd_N0rw@y" // TODO: Fix environment variable loading in proxy
    const cookieValue = request.cookies.get('admin-access')?.value
    const hasAccess = adminPassword && cookieValue === adminPassword

    if (!hasAccess) {
      // Redirect to a simple password verification page
      const loginUrl = new URL('/admin-login', request.url)
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
