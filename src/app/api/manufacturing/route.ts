import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import initialManufacturing from '@/src/data/manufacturing.json'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'manufacturing.json')
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8')
      return NextResponse.json(JSON.parse(data))
    }
    return NextResponse.json(initialManufacturing)
  } catch (error) {
    console.error('Error reading manufacturing.json:', error)
    return NextResponse.json(initialManufacturing)
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const filePath = path.join(process.cwd(), 'src', 'data', 'manufacturing.json')
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2), 'utf8')
    return NextResponse.json({ success: true, data: body })
  } catch (error) {
    console.error('Error saving manufacturing.json:', error)
    return NextResponse.json({ error: 'Failed to save manufacturing data' }, { status: 500 })
  }
}
