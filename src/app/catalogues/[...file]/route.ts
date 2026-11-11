import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ file: string[] }> | { file: string[] } }
) {
  try {
    const resolvedParams = await Promise.resolve(params)
    const fileSegments = resolvedParams.file || []
    const relativePath = fileSegments.join('/')
    const fullPath = path.join(process.cwd(), 'public', 'catalogues', relativePath)

    if (!fs.existsSync(fullPath)) {
      return new NextResponse('File Not Found', { status: 404 })
    }

    const buffer = fs.readFileSync(fullPath)
    const ext = path.extname(fullPath).toLowerCase()

    let contentType = 'application/octet-stream'
    if (ext === '.pdf') contentType = 'application/pdf'
    else if (ext === '.png') contentType = 'image/png'
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg'
    else if (ext === '.webp') contentType = 'image/webp'

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (err: any) {
    return new NextResponse('Error reading file: ' + err.message, { status: 500 })
  }
}

