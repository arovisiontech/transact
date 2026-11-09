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

  // 3. Secret Preview Custom Link (/preview, /secret-preview, /access)
  // Clicking or opening /preview instantly unlocks the website for 1 year and redirects to homepage
  if (
    pathname === '/preview' ||
    pathname === '/secret-preview' ||
    pathname === '/access'
  ) {
    // If exit or reset requested: clear bypass
    if (searchParams.get('exit') === '1' || searchParams.get('reset') === '1') {
      const response = NextResponse.redirect(new URL('/', request.url))
      response.cookies.delete('transact_geo_bypass')
      return response
    }

    const target = searchParams.get('to') || '/'
    const cleanUrl = new URL(target, request.url)
    const response = NextResponse.redirect(cleanUrl)
    response.cookies.set('transact_geo_bypass', 'true', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false,
      sameSite: 'lax',
    })
    return response
  }

  // 4. Always allow /blocked page
  if (pathname === '/blocked') {
    return NextResponse.next()
  }

  // 5. Check for secret bypass query parameters in URL
  // e.g. ?preview=1 or ?bypass_geo=transact or ?secret=transact
  const bypassParam =
    searchParams.get('bypass_geo') ||
    searchParams.get('preview') ||
    searchParams.get('secret')

  if (
    bypassParam === 'transact' ||
    bypassParam === 'transact2026' ||
    bypassParam === '1' ||
    bypassParam === 'true'
  ) {
    const cleanUrl = new URL(pathname, request.url)
    cleanUrl.searchParams.delete('bypass_geo')
    cleanUrl.searchParams.delete('preview')
    cleanUrl.searchParams.delete('secret')
    const response = NextResponse.redirect(cleanUrl)
    response.cookies.set('transact_geo_bypass', 'true', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false,
      sameSite: 'lax',
    })
    return response
  }

  // 6. If visitor has active bypass cookie, allow full access
  const hasBypassCookie = request.cookies.get('transact_geo_bypass')?.value === 'true'
  if (hasBypassCookie) {
    return NextResponse.next()
  }

  // 7. Check if regional blocking was disabled by admin in settings
  const blockSettingCookie = request.cookies.get('transact_block_pk')?.value
  if (blockSettingCookie === 'false') {
    return NextResponse.next()
  }

  // 8. Detect country from Cloudflare, Vercel, Hostinger or proxy headers
  const country = (
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('x-country-code') ||
    request.headers.get('x-geo-country') ||
    request.cookies.get('transact_visitor_country')?.value ||
    ''
  ).toUpperCase()

  // 9. If visitor is from Pakistan (PK) and not bypassed:
  // Return generic Apache/Nginx 404 Not Found so NO website or branding appears in Pakistan
  if (country === 'PK' || country === 'PAKISTAN') {
    return new NextResponse(
      `<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">\n<html><head>\n<title>404 Not Found</title>\n</head><body>\n<h1>Not Found</h1>\n<p>The requested URL was not found on this server.</p>\n<hr>\n<address>Apache Server at ${request.nextUrl.host} Port 80</address>\n</body></html>`,
      {
        status: 404,
        statusText: 'Not Found',
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      }
    )
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
