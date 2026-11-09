import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import initialSettings from '@/src/data/storeSettings.json'

const filePath = path.join(process.cwd(), 'src', 'data', 'storeSettings.json')

function readSettings() {
  try {
    if (!fs.existsSync(filePath)) return initialSettings
    const content = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(content)
  } catch (e) {
    console.error('Error reading storeSettings.json:', e)
    return initialSettings
  }
}

function writeSettings(settings: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), 'utf8')
  } catch (err) {
    console.warn('Could not write to storeSettings.json file:', err)
  }
}

export async function GET() {
  const settings = readSettings()
  return NextResponse.json(settings, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const updatedSettings = await req.json()
    const current = readSettings()
    const merged = { ...current, ...updatedSettings }
    writeSettings(merged)

    return NextResponse.json({ success: true, settings: merged })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
