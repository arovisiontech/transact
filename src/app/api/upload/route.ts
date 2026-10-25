import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'


export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const file = formData.get('file') as File | null
      const requestedFolder = (formData.get('folder') as string) || ''

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Determine directory based on file type / folder parameter
      const ext = path.extname(file.name).toLowerCase() || '.png'
      const isPdf = ext === '.pdf' || file.type === 'application/pdf'

      let uploadSubDir = 'images/uploads'
      if (isPdf || requestedFolder === 'catalogues') {
        uploadSubDir = 'catalogues'
      } else if (requestedFolder === 'images/catalogues') {
        uploadSubDir = 'images/catalogues'
      }

      const uploadDir = path.join(process.cwd(), 'public', uploadSubDir)
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }

      // Clean filename
      const base = path
        .basename(file.name, ext)
        .replace(/[^a-zA-Z0-9-_]/g, '-')
        .toLowerCase()
      const uniqueName = `${base}-${Date.now()}${ext}`
      const filePath = path.join(uploadDir, uniqueName)

      fs.writeFileSync(filePath, buffer)
      const publicUrl = `/${uploadSubDir}/${uniqueName}`

      // Human-readable file size
      const sizeBytes = buffer.length
      const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(1)
      const fileSizeStr = sizeBytes > 1024 * 1024 ? `${sizeMB} MB` : `${Math.round(sizeBytes / 1024)} KB`

      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename: uniqueName,
        size: fileSizeStr,
        sizeBytes,
      })
    }

    // Fallback: JSON with base64 data
    const body = await req.json()
    if (body.base64) {
      const requestedFolder = body.folder || 'images/uploads'
      const uploadDir = path.join(process.cwd(), 'public', requestedFolder)
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }

      const matches = body.base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
      let buffer: Buffer
      let ext = '.png'

      if (matches && matches.length === 3) {
        const mime = matches[1]
        if (mime.includes('pdf')) ext = '.pdf'
        else if (mime.includes('jpeg') || mime.includes('jpg')) ext = '.jpg'
        else if (mime.includes('svg')) ext = '.svg'
        else if (mime.includes('webp')) ext = '.webp'
        buffer = Buffer.from(matches[2], 'base64')
      } else {
        buffer = Buffer.from(body.base64, 'base64')
      }

      const uniqueName = `upload-${Date.now()}${ext}`
      const filePath = path.join(uploadDir, uniqueName)
      fs.writeFileSync(filePath, buffer)

      const sizeBytes = buffer.length
      const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(1)
      const fileSizeStr = sizeBytes > 1024 * 1024 ? `${sizeMB} MB` : `${Math.round(sizeBytes / 1024)} KB`

      return NextResponse.json({
        success: true,
        url: `/${requestedFolder}/${uniqueName}`,
        filename: uniqueName,
        size: fileSizeStr,
        sizeBytes,
      })
    }

    return NextResponse.json({ error: 'Unsupported format' }, { status: 400 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
