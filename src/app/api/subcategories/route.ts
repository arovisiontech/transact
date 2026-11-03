import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { SubcategoryItem } from '@/src/types'

const filePath = path.join(process.cwd(), 'src', 'data', 'subcategories.json')

function readSubcategories(): SubcategoryItem[] {
  try {
    if (!fs.existsSync(filePath)) return []
    const content = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(content)
  } catch (e) {
    console.error('Error reading subcategories.json:', e)
    return []
  }
}

function writeSubcategories(subcategories: SubcategoryItem[]) {
  fs.writeFileSync(filePath, JSON.stringify(subcategories, null, 2), 'utf8')
}

export async function GET() {
  const subcategories = readSubcategories()
  return NextResponse.json(subcategories, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    let subcategories = readSubcategories()

    if (body.action === 'save' && body.subcategory) {
      const idx = subcategories.findIndex((s) => s.id === body.subcategory.id)
      if (idx !== -1) {
        subcategories[idx] = {
          ...subcategories[idx],
          ...body.subcategory,
          updated_at: new Date().toISOString(),
        }
      } else {
        subcategories.push({
          ...body.subcategory,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
      writeSubcategories(subcategories)
    } else if (body.action === 'delete' && body.id) {
      subcategories = subcategories.filter((s) => s.id !== body.id)
      writeSubcategories(subcategories)
    } else if (body.action === 'setAll' && Array.isArray(body.subcategories)) {
      subcategories = body.subcategories
      writeSubcategories(subcategories)
    }

    return NextResponse.json({ success: true, subcategories })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
