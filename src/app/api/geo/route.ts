import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    country: 'GLOBAL',
    isBlocked: false,
    source: 'disabled',
  })
}
