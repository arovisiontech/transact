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
    const fullPath = path.join(process.cwd(), 'public', 'images', relativePath)

    if (!fs.existsSync(fullPath)) {
      return new NextResponse('Image Not Found', { status: 404 })
    }

    const buffer = fs.readFileSync(fullPath)
    const ext = path.extname(fullPath).toLowerCase()

    let contentType = 'application/octet-stream'
    if (ext === '.png') contentType = 'image/png'
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg'
    else if (ext === '.svg') contentType = 'image/svg+xml'
    else if (ext === '.webp') contentType = 'image/webp'
    else if (ext === '.gif') contentType = 'image/gif'
    else if (ext === '.pdf') contentType = 'application/pdf'
    else if (ext === '.mp4') contentType = 'video/mp4'

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (err: any) {
    return new NextResponse('Error reading image: ' + err.message, { status: 500 })
  }
}
