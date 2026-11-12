import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { ProductItem } from '@/src/types'

const filePath = path.join(process.cwd(), 'src', 'data', 'products.json')

let memoryProductsCache: ProductItem[] | null = null

function readProducts(): ProductItem[] {
  if (memoryProductsCache && memoryProductsCache.length > 0) {
    return memoryProductsCache
  }
  try {
    if (!fs.existsSync(filePath)) return []
    const content = fs.readFileSync(filePath, 'utf8')
    const parsed = JSON.parse(content)
    memoryProductsCache = parsed
    return parsed
  } catch (e) {
    console.error('Error reading products.json:', e)
    return memoryProductsCache || []
  }
}

function writeProducts(products: ProductItem[]) {
  memoryProductsCache = products
  try {
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf8')
  } catch (err) {
    console.warn('Could not write to products.json file (e.g. read-only env):', err)
  }
}

export async function GET() {
  const products = readProducts()
  return NextResponse.json(products, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    let products = readProducts()

    if (body.action === 'save' && body.product) {
      const idx = products.findIndex((p) => p.id === body.product.id)
      if (idx !== -1) {
        products[idx] = { ...products[idx], ...body.product, updated_at: new Date().toISOString() }
      } else {
        products.unshift({
          ...body.product,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
      writeProducts(products)
    } else if (body.action === 'delete' && body.id) {
      products = products.filter((p) => p.id !== body.id)
      writeProducts(products)
    } else if (body.action === 'setAll' && Array.isArray(body.products)) {
      products = body.products
      writeProducts(products)
    }

    return NextResponse.json({ success: true, products })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
