import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Pakistan Country Geo-blocking Middleware
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // 1. Always allow static files, next internals, and asset extensions
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(png|jpg|jpeg|svg|webp|gif|mp4|pdf|ico|txt|xml|json)$/i)
  ) {
    return NextResponse.next()
  }

  // 2. Always allow /admin and admin tools (Admins / Developers in Pakistan must not be locked out)
  if (pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // 3. Always allow /blocked page to prevent redirect loops
  if (pathname === '/blocked') {
    return NextResponse.next()
  }

  // 4. Check for secret bypass parameter or cookie
  // Visiting ?bypass_geo=transact sets a 30-day cookie allowing preview from Pakistan
  const bypassParam = searchParams.get('bypass_geo')
  const hasBypassCookie = request.cookies.get('transact_geo_bypass')?.value === 'true'

  if (bypassParam === 'transact' || bypassParam === 'transact2026') {
    const redirectUrl = new URL(pathname, request.url)
    const response = NextResponse.redirect(redirectUrl)
    response.cookies.set('transact_geo_bypass', 'true', {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false,
      sameSite: 'lax',
    })
    return response
  }

  if (hasBypassCookie) {
    return NextResponse.next()
  }

  // 5. Detect country from Cloudflare, Vercel, Hostinger or proxy headers
  const country = (
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('x-country-code') ||
    request.headers.get('x-geo-country') ||
    request.cookies.get('transact_visitor_country')?.value ||
    ''
  ).toUpperCase()

  // 6. Block if visitor is identified from Pakistan
  if (country === 'PK' || country === 'PAKISTAN') {
    const blockedUrl = new URL('/blocked', request.url)
    return NextResponse.rewrite(blockedUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
