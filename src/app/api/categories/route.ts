import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { CategoryItem } from '@/src/types'

const filePath = path.join(process.cwd(), 'src', 'data', 'categories.json')

function readCategories(): CategoryItem[] {
  try {
    if (!fs.existsSync(filePath)) return []
    const content = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(content)
  } catch (e) {
    console.error('Error reading categories.json:', e)
    return []
  }
}

function writeCategories(categories: CategoryItem[]) {
  fs.writeFileSync(filePath, JSON.stringify(categories, null, 2), 'utf8')
}

export async function GET() {
  const categories = readCategories()
  return NextResponse.json(categories, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    let categories = readCategories()

    if (body.action === 'save' && body.category) {
      const idx = categories.findIndex((c) => c.id === body.category.id)
      if (idx !== -1) {
        categories[idx] = { ...categories[idx], ...body.category, updated_at: new Date().toISOString() }
      } else {
        categories.unshift({
          ...body.category,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
      writeCategories(categories)
    } else if (body.action === 'delete' && body.id) {
      categories = categories.filter((c) => c.id !== body.id)
      writeCategories(categories)
    } else if (body.action === 'setAll' && Array.isArray(body.categories)) {
      categories = body.categories
      writeCategories(categories)
    }

    return NextResponse.json({ success: true, categories })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
