import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { FaqItem } from '@/src/types'

const filePath = path.join(process.cwd(), 'src', 'data', 'faqs.json')

function readFaqs(): FaqItem[] {
  try {
    if (!fs.existsSync(filePath)) return []
    const content = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(content)
  } catch (e) {
    console.error('Error reading faqs.json:', e)
    return []
  }
}

function writeFaqs(faqs: FaqItem[]) {
  fs.writeFileSync(filePath, JSON.stringify(faqs, null, 2), 'utf8')
}

export async function GET() {
  const faqs = readFaqs()
  return NextResponse.json(faqs, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    let faqs = readFaqs()

    if (body.action === 'save' && body.faq) {
      const idx = faqs.findIndex((f) => f.id === body.faq.id)
      if (idx !== -1) {
        faqs[idx] = { ...faqs[idx], ...body.faq }
      } else {
        faqs.push({
          ...body.faq,
          id: body.faq.id || `faq-${Date.now()}`,
        })
      }
      writeFaqs(faqs)
    } else if (body.action === 'delete' && body.id) {
      faqs = faqs.filter((f) => f.id !== body.id)
      writeFaqs(faqs)
    } else if (body.action === 'setAll' && Array.isArray(body.faqs)) {
      faqs = body.faqs
      writeFaqs(faqs)
    }

    return NextResponse.json({ success: true, faqs })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
