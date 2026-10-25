import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { CatalogueItem } from '@/src/types'

const filePath = path.join(process.cwd(), 'src', 'data', 'catalogues.json')

function readCatalogues(): CatalogueItem[] {
  try {
    if (!fs.existsSync(filePath)) return []
    const content = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(content)
  } catch (e) {
    console.error('Error reading catalogues.json:', e)
    return []
  }
}

function writeCatalogues(catalogues: CatalogueItem[]) {
  fs.writeFileSync(filePath, JSON.stringify(catalogues, null, 2), 'utf8')
}

export async function GET() {
  const catalogues = readCatalogues()
  return NextResponse.json(catalogues, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    let catalogues = readCatalogues()

    if (body.action === 'save' && body.catalogue) {
      const idx = catalogues.findIndex((c) => c.id === body.catalogue.id)
      if (idx !== -1) {
        catalogues[idx] = { ...catalogues[idx], ...body.catalogue, updated_at: new Date().toISOString() }
      } else {
        catalogues.unshift({
          ...body.catalogue,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
      writeCatalogues(catalogues)
    } else if (body.action === 'delete' && body.id) {
      catalogues = catalogues.filter((c) => c.id !== body.id)
      writeCatalogues(catalogues)
    } else if (body.action === 'setAll' && Array.isArray(body.catalogues)) {
      catalogues = body.catalogues
      writeCatalogues(catalogues)
    }

    return NextResponse.json({ success: true, catalogues })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
