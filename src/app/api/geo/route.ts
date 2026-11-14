import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // 1. Check Cloudflare / Hostinger proxy country headers
    const headerCountry = (
      req.headers.get('cf-ipcountry') ||
      req.headers.get('x-vercel-ip-country') ||
      req.headers.get('x-country-code') ||
      req.headers.get('x-geo-country') ||
      req.cookies.get('transact_visitor_country')?.value ||
      ''
    ).toUpperCase()

    const isBypassed =
      req.cookies.get('transact_geo_bypass')?.value === 'true' ||
      req.nextUrl.searchParams.get('bypass_geo') === 'transact' ||
      req.nextUrl.searchParams.get('preview') === '1' ||
      req.nextUrl.searchParams.get('preview') === 'true' ||
      req.nextUrl.searchParams.get('preview') === 'transact' ||
      req.nextUrl.searchParams.get('secret') === 'transact'

    if (headerCountry && headerCountry !== 'XX' && headerCountry !== 'T1') {
      const isBlocked = (headerCountry === 'PK' || headerCountry === 'PAKISTAN') && !isBypassed
      return NextResponse.json({
        country: headerCountry,
        isBlocked,
        source: 'header',
      })
    }

    // 2. Extract client IP
    const forwardedFor = req.headers.get('x-forwarded-for')
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : req.headers.get('x-real-ip') || ''

    if (!clientIp || clientIp === '127.0.0.1' || clientIp === '::1' || clientIp.startsWith('192.168.') || clientIp.startsWith('10.')) {
      return NextResponse.json({
        country: 'LOCAL',
        isBlocked: false,
        source: 'localhost',
      })
    }

    // Fast IP-to-country lookup
    try {
      const geoRes = await fetch(`https://api.country.is/${clientIp}`, {
        next: { revalidate: 3600 },
      })
      if (geoRes.ok) {
        const geoData = await geoRes.json()
        const country = (geoData.country || '').toUpperCase()
        const isBlocked = country === 'PK' && !isBypassed
        return NextResponse.json({
          country,
          isBlocked,
          source: 'api',
        })
      }
    } catch {
      // Fallback
    }

    return NextResponse.json({
      country: 'GLOBAL',
      isBlocked: false,
      source: 'fallback',
    })
  } catch (err: any) {
    return NextResponse.json({
      country: 'ERROR',
      isBlocked: false,
      error: err.message,
    })
  }
}
