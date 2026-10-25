import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'src', 'data', 'about.json')

function readAbout() {
  try {
    if (!fs.existsSync(filePath)) return {}
    const content = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(content)
  } catch (e) {
    console.error('Error reading about.json:', e)
    return {}
  }
}

function writeAbout(data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
}

export async function GET() {
  const data = readAbout()
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    writeAbout(body)
    return NextResponse.json({ success: true, data: body })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
