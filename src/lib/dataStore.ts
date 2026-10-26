import {
  ProductItem,
  CategoryItem,
  CatalogueItem,
  HeroSlideItem,
  BannerItem,
  ContactInquiryItem,
  StoreSettings,
  QuoteCartItem,
  ProductLineShowcase,
  ProjectDevelopmentSection,
  PrecisionManufacturingSection,
  FaqItem,
} from '@/src/types'
import initialCategories from '@/src/data/categories.json'
import initialProducts from '@/src/data/products.json'
import initialCatalogues from '@/src/data/catalogues.json'
import initialFaqs from '@/src/data/faqs.json'
import initialStoreSettings from '@/src/data/storeSettings.json'
import initialHeroSlides from '@/src/data/heroSlides.json'
import { createClient } from './supabase/client'

const STORAGE_KEYS = {
  PRODUCTS: 'transact_products_v2',
  CATEGORIES: 'transact_categories_v2',
  CATALOGUES: 'transact_catalogues_v2',
  HERO_SLIDES: 'transact_hero_slides_v2',
  BANNERS: 'transact_banners_v2',
  INQUIRIES: 'transact_inquiries_v2',
  SETTINGS: 'transact_settings_v2',
  QUOTE_CART: 'transact_quote_cart_v2',
  PRODUCT_LINE: 'transact_product_line_v2',
  PROJECT_DEV: 'transact_project_dev_v2',
  PRECISION_MFG: 'transact_precision_mfg_v2',
  FAQS: 'transact_faqs_v2',
}

// In-Memory State Cache
let memoryProducts: ProductItem[] = initialProducts as unknown as ProductItem[]
let memoryCategories: CategoryItem[] = initialCategories as unknown as CategoryItem[]
let memoryCatalogues: CatalogueItem[] = initialCatalogues as unknown as CatalogueItem[]
let memoryFaqs: FaqItem[] = initialFaqs as unknown as FaqItem[]
let memoryHeroSlides: HeroSlideItem[] = initialHeroSlides as unknown as HeroSlideItem[]
let memoryBanners: BannerItem[] = []
let memoryInquiries: ContactInquiryItem[] = []
let memorySettings: StoreSettings = initialStoreSettings as StoreSettings
let memoryQuoteCart: QuoteCartItem[] = []

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

function getFromStorage<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (!isBrowser()) return
  try {
    localStorage.setItem(key, JSON.stringify(value))
    window.dispatchEvent(new Event('transact_data_updated'))
  } catch (err) {
    console.error(`Failed to save to storage ${key}:`, err)
  }
}

let syncInitiated = false

export async function initLiveSupabase(): Promise<void> {
  if (!isBrowser() || syncInitiated) return
  syncInitiated = true

  try {
    // 1. First fetch latest data from server-side JSON API (works across all devices, survives refreshes)
    try {
      const [serverProdsRes, serverCatsRes, serverCatsLogRes, serverFaqsRes] = await Promise.all([
        fetch('/api/products', { cache: 'no-store' }),
        fetch('/api/categories', { cache: 'no-store' }),
        fetch('/api/catalogues', { cache: 'no-store' }),
        fetch('/api/faqs', { cache: 'no-store' }),
      ])
      if (serverProdsRes.ok) {
        const p = await serverProdsRes.json()
        if (Array.isArray(p) && p.length > 0) {
          memoryProducts = p
          saveToStorage(STORAGE_KEYS.PRODUCTS, p)
        }
      }
      if (serverCatsRes.ok) {
        const c = await serverCatsRes.json()
        if (Array.isArray(c) && c.length > 0) {
          memoryCategories = c
          saveToStorage(STORAGE_KEYS.CATEGORIES, c)
        }
      }
      if (serverCatsLogRes.ok) {
        const catlog = await serverCatsLogRes.json()
        if (Array.isArray(catlog) && catlog.length > 0) {
          memoryCatalogues = catlog
          saveToStorage(STORAGE_KEYS.CATALOGUES, catlog)
        }
      }
      if (serverFaqsRes && serverFaqsRes.ok) {
        const faqs = await serverFaqsRes.json()
        if (Array.isArray(faqs) && faqs.length > 0) {
          memoryFaqs = faqs
          saveToStorage(STORAGE_KEYS.FAQS, faqs)
        }
      }
    } catch (apiErr) {
      console.warn('Server JSON API sync skipped:', apiErr)
    }

    const {
      fetchLiveHeroSlides,
      fetchLiveProducts,
      fetchLiveCategories,
      fetchLiveCatalogues,
      setupSupabaseRealtime,
    } = await import('./supabaseSync')

    const [slides, prods, cats, catalogues] = await Promise.all([
      fetchLiveHeroSlides(),
      fetchLiveProducts(),
      fetchLiveCategories(),
      fetchLiveCatalogues(),
    ])

    if (slides && slides.length > 0) {
      memoryHeroSlides = slides
      saveToStorage(STORAGE_KEYS.HERO_SLIDES, slides)
    }

    if (cats && cats.length > 0) {
      memoryCategories = cats
      saveToStorage(STORAGE_KEYS.CATEGORIES, cats)
    }

    if (catalogues && catalogues.length > 0) {
      memoryCatalogues = catalogues
      saveToStorage(STORAGE_KEYS.CATALOGUES, catalogues)
    }

    // Setup listener so any other computer or mobile device updates in real time
    setupSupabaseRealtime(async () => {
      const [freshSlides, freshProds, freshCats, freshCatalogues] = await Promise.all([
        fetchLiveHeroSlides(),
        fetchLiveProducts(),
        fetchLiveCategories(),
        fetchLiveCatalogues(),
      ])
      if (freshSlides.length) {
        memoryHeroSlides = freshSlides
        saveToStorage(STORAGE_KEYS.HERO_SLIDES, freshSlides)
      }
      if (freshCats.length) {
        memoryCategories = freshCats
        saveToStorage(STORAGE_KEYS.CATEGORIES, freshCats)
      }
      if (freshCatalogues.length) {
        memoryCatalogues = freshCatalogues
        saveToStorage(STORAGE_KEYS.CATALOGUES, freshCatalogues)
      }
    })
  } catch (err) {
    console.warn('Initial Supabase live sync skipped or offline:', err)
  }
}

// Auto-trigger on client
if (isBrowser()) {
  setTimeout(() => {
    initLiveSupabase()
  }, 50)
}


// ============================================
// PRODUCTS API
// ============================================
export function getStoredProducts(): ProductItem[] {
  if (isBrowser()) {
    const fromStorage = getFromStorage<ProductItem[]>(STORAGE_KEYS.PRODUCTS, [])
    if (fromStorage.length > 0) {
      // Filter out any stale motorcycle products from previous sessions
      const clean = fromStorage.filter((p) => {
        const text = `${p.title || ''} ${p.slug || ''} ${p.featured_image || ''}`.toLowerCase()
        return (
          !text.includes('motorcycle') &&
          !text.includes('glove') &&
          !text.includes('jacket') &&
          !text.includes('trouser') &&
          !text.includes('carbon tech') &&
          !text.includes('torque') &&
          !text.includes('durable') &&
          !text.includes('tourer')
        )
      })
      if (clean.length !== fromStorage.length) {
        saveToStorage(STORAGE_KEYS.PRODUCTS, clean.length > 0 ? clean : memoryProducts)
      }
      if (clean.length > 0) return clean
    }
    saveToStorage(STORAGE_KEYS.PRODUCTS, memoryProducts)
  }
  return memoryProducts
}

export function getProductBySlug(slug: string): ProductItem | undefined {
  const prods = getStoredProducts()
  return prods.find((p) => p.slug === slug)
}

export function getProductById(id: string): ProductItem | undefined {
  const prods = getStoredProducts()
  return prods.find((p) => p.id === id)
}

export function getProductsByCategory(categoryIdOrSlug: string): ProductItem[] {
  const prods = getStoredProducts()
  return prods.filter(
    (p) =>
      p.category_id === categoryIdOrSlug ||
      p.category_name?.toLowerCase().replace(/\s+/g, '-') === categoryIdOrSlug.toLowerCase()
  )
}

export async function saveProduct(product: ProductItem): Promise<ProductItem> {
  const prods = [...getStoredProducts()]
  const existingIdx = prods.findIndex((p) => p.id === product.id)

  const updatedProduct: ProductItem = {
    ...product,
    updated_at: new Date().toISOString(),
  }

  if (existingIdx >= 0) {
    prods[existingIdx] = updatedProduct
  } else {
    prods.unshift(updatedProduct)
  }

  memoryProducts = prods
  saveToStorage(STORAGE_KEYS.PRODUCTS, prods)

  // Persist directly to server JSON file for cross-device & refresh persistence
  if (isBrowser()) {
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', product: updatedProduct }),
      })
    } catch (err) {
      console.warn('Failed to persist product to server API:', err)
    }
  }

  // Try saving to Supabase in background
  try {
    const supabase = createClient()
    await supabase.from('products').upsert({
      id: updatedProduct.id,
      name: updatedProduct.title,
      slug: updatedProduct.slug,
      sku: updatedProduct.sku,
      price: updatedProduct.price,
      short_description: updatedProduct.short_description,
      description: updatedProduct.full_description,
      main_image_url: updatedProduct.featured_image,
      category_id: updatedProduct.category_id,
      is_active: updatedProduct.is_published,
      is_published: updatedProduct.is_published,
      is_featured: updatedProduct.is_featured,
      sort_order: updatedProduct.sort_order,
      source_data: updatedProduct,
      updated_at: updatedProduct.updated_at,
    })
  } catch (err) {
    console.warn('Supabase sync skipped for saveProduct:', err)
  }

  return updatedProduct
}

export async function deleteProduct(id: string): Promise<boolean> {
  const prods = getStoredProducts().filter((p) => p.id !== id)
  memoryProducts = prods
  saveToStorage(STORAGE_KEYS.PRODUCTS, prods)

  // Persist deletion directly to server JSON file
  if (isBrowser()) {
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      })
    } catch (err) {
      console.warn('Failed to delete product from server API:', err)
    }
  }

  try {
    const supabase = createClient()
    await supabase.from('products').delete().eq('id', id)
  } catch (err) {
    console.warn('Supabase delete skipped:', err)
  }

  return true
}

export async function moveProductOrder(id: string, direction: 'up' | 'down'): Promise<ProductItem[]> {
  const prods = [...getStoredProducts()]
  const idx = prods.findIndex((p) => p.id === id)
  if (idx < 0) return prods

  const targetIdx = direction === 'up' ? idx - 1 : idx + 1
  if (targetIdx < 0 || targetIdx >= prods.length) return prods

  // Swap sort orders and positions
  const tempOrder = prods[idx].sort_order
  prods[idx].sort_order = prods[targetIdx].sort_order
  prods[targetIdx].sort_order = tempOrder

  const temp = prods[idx]
  prods[idx] = prods[targetIdx]
  prods[targetIdx] = temp

  memoryProducts = prods
  saveToStorage(STORAGE_KEYS.PRODUCTS, prods)

  // Persist reorder to server JSON file
  if (isBrowser()) {
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'setAll', products: prods }),
    }).catch((err) => console.warn('Failed to update product order on server API:', err))
  }

  try {
    const supabase = createClient()
    await supabase.from('products').upsert([
      { id: prods[idx].id, sort_order: prods[idx].sort_order },
      { id: prods[targetIdx].id, sort_order: prods[targetIdx].sort_order },
    ])
  } catch (err) {
    console.warn('Supabase product reorder error:', err)
  }

  return prods
}

// ============================================
// CATEGORIES API
// ============================================
export function getStoredCategories(): CategoryItem[] {
  if (isBrowser()) {
    const fromStorage = getFromStorage<CategoryItem[]>(STORAGE_KEYS.CATEGORIES, [])
    if (fromStorage.length > 0) return fromStorage
    saveToStorage(STORAGE_KEYS.CATEGORIES, memoryCategories)
  }
  return memoryCategories
}

export function getCategoryBySlug(slug: string): CategoryItem | undefined {
  const cats = getStoredCategories()
  return cats.find((c) => c.slug === slug)
}

export function getCategoryById(id: string): CategoryItem | undefined {
  const cats = getStoredCategories()
  return cats.find((c) => c.id === id)
}

export async function saveCategory(category: CategoryItem): Promise<CategoryItem> {
  const cats = [...getStoredCategories()]
  const existingIdx = cats.findIndex((c) => c.id === category.id)

  const updatedCategory: CategoryItem = {
    ...category,
    updated_at: new Date().toISOString(),
  }

  if (existingIdx >= 0) {
    cats[existingIdx] = updatedCategory
  } else {
    cats.push(updatedCategory)
  }

  memoryCategories = cats
  saveToStorage(STORAGE_KEYS.CATEGORIES, cats)

  // Persist category to server JSON file
  if (isBrowser()) {
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', category: updatedCategory }),
      })
    } catch (err) {
      console.warn('Failed to persist category to server API:', err)
    }
  }

  try {
    const supabase = createClient()
    await supabase.from('categories').upsert({
      id: updatedCategory.id,
      name: updatedCategory.name,
      slug: updatedCategory.slug,
      description: updatedCategory.description,
      image_url: updatedCategory.image_url,
      sort_order: updatedCategory.sort_order,
      is_active: updatedCategory.is_published,
      updated_at: updatedCategory.updated_at,
    })
  } catch (err) {
    console.warn('Supabase sync skipped for saveCategory:', err)
  }

  return updatedCategory
}

export async function deleteCategory(id: string): Promise<boolean> {
  const cats = getStoredCategories().filter((c) => c.id !== id)
  memoryCategories = cats
  saveToStorage(STORAGE_KEYS.CATEGORIES, cats)

  // Persist category deletion to server JSON file
  if (isBrowser()) {
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      })
    } catch (err) {
      console.warn('Failed to delete category from server API:', err)
    }
  }

  try {
    const supabase = createClient()
    await supabase.from('categories').delete().eq('id', id)
  } catch (err) {
    console.warn('Supabase delete category skipped:', err)
  }

  return true
}

export function moveCategoryOrder(id: string, direction: 'up' | 'down'): CategoryItem[] {
  const cats = [...getStoredCategories()]
  const idx = cats.findIndex((c) => c.id === id)
  if (idx < 0) return cats

  const targetIdx = direction === 'up' ? idx - 1 : idx + 1
  if (targetIdx < 0 || targetIdx >= cats.length) return cats

  const tempOrder = cats[idx].sort_order
  cats[idx].sort_order = cats[targetIdx].sort_order
  cats[targetIdx].sort_order = tempOrder

  const temp = cats[idx]
  cats[idx] = cats[targetIdx]
  cats[targetIdx] = temp

  memoryCategories = cats
  saveToStorage(STORAGE_KEYS.CATEGORIES, cats)

  // Persist category order to server JSON file
  if (isBrowser()) {
    fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'setAll', categories: cats }),
    }).catch((err) => console.warn('Failed to update category order on server API:', err))
  }
  return cats
}

// ============================================
// CATALOGUES API
// ============================================
export function getStoredCatalogues(): CatalogueItem[] {
  if (isBrowser()) {
    const fromStorage = getFromStorage<CatalogueItem[]>(STORAGE_KEYS.CATALOGUES, [])
    if (fromStorage.length > 0) return fromStorage
    saveToStorage(STORAGE_KEYS.CATALOGUES, memoryCatalogues)
  }
  return memoryCatalogues
}

export async function saveCatalogue(catalogue: CatalogueItem): Promise<CatalogueItem> {
  const cats = [...getStoredCatalogues()]
  const existingIdx = cats.findIndex((c) => c.id === catalogue.id)

  const updated: CatalogueItem = {
    ...catalogue,
    updated_at: new Date().toISOString(),
  }

  if (existingIdx >= 0) {
    cats[existingIdx] = updated
  } else {
    cats.push(updated)
  }

  memoryCatalogues = cats
  saveToStorage(STORAGE_KEYS.CATALOGUES, cats)

  // Persist catalogue to server JSON file
  if (isBrowser()) {
    fetch('/api/catalogues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save', catalogue: updated }),
    }).catch((err) => console.warn('Failed to persist catalogue to server API:', err))
  }

  try {
    const supabase = createClient()
    await supabase.from('catalogues').upsert({
      id: updated.id,
      title: updated.title,
      slug: updated.slug,
      file_url: updated.pdf_url,
      thumbnail_url: updated.cover_image,
      is_active: updated.is_published,
      sort_order: updated.sort_order,
    })
  } catch (err) {
    console.warn('Supabase sync skipped for catalogue:', err)
  }

  return updated
}

export async function deleteCatalogue(id: string): Promise<boolean> {
  const cats = getStoredCatalogues().filter((c) => c.id !== id)
  memoryCatalogues = cats
  saveToStorage(STORAGE_KEYS.CATALOGUES, cats)

  // Persist catalogue deletion to server JSON file
  if (isBrowser()) {
    fetch('/api/catalogues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id }),
    }).catch((err) => console.warn('Failed to delete catalogue from server API:', err))
  }
  return true
}

// ============================================
// HERO SLIDES API
// ============================================
export function getStoredHeroSlides(): HeroSlideItem[] {
  if (isBrowser()) {
    const fromStorage = getFromStorage<HeroSlideItem[]>(STORAGE_KEYS.HERO_SLIDES, [])
    if (fromStorage.length > 0) return fromStorage
    saveToStorage(STORAGE_KEYS.HERO_SLIDES, memoryHeroSlides)
  }
  return memoryHeroSlides
}

export async function saveHeroSlide(slide: HeroSlideItem): Promise<HeroSlideItem> {
  const slides = [...getStoredHeroSlides()]
  const existingIdx = slides.findIndex((s) => s.id === slide.id)

  if (existingIdx >= 0) {
    slides[existingIdx] = slide
  } else {
    slides.push(slide)
  }

  memoryHeroSlides = slides
  saveToStorage(STORAGE_KEYS.HERO_SLIDES, slides)

  // Live Sync to Supabase
  try {
    const supabase = createClient()
    await supabase.from('hero_slides').upsert({
      id: slide.id,
      title: slide.title,
      description: slide.subtitle,
      eyebrow: slide.badge,
      image_url: slide.image,
      video_url: slide.video_url || '',
      button_text: slide.primaryCtaText,
      button_url: slide.primaryCtaLink,
      sort_order: slide.sort_order,
      is_active: slide.is_active,
      updated_at: new Date().toISOString(),
    })
  } catch (err) {
    console.warn('Supabase hero_slides upsert error:', err)
  }

  return slide
}

export async function deleteHeroSlide(id: string): Promise<boolean> {
  const slides = getStoredHeroSlides().filter((s) => s.id !== id)
  memoryHeroSlides = slides
  saveToStorage(STORAGE_KEYS.HERO_SLIDES, slides)

  try {
    const supabase = createClient()
    await supabase.from('hero_slides').delete().eq('id', id)
  } catch (err) {
    console.warn('Supabase hero_slides delete error:', err)
  }

  return true
}

export async function moveHeroSlideOrder(id: string, direction: 'up' | 'down'): Promise<HeroSlideItem[]> {
  const slides = [...getStoredHeroSlides()].sort((a, b) => a.sort_order - b.sort_order)
  const idx = slides.findIndex((s) => s.id === id)
  if (idx < 0) return slides

  const targetIdx = direction === 'up' ? idx - 1 : idx + 1
  if (targetIdx < 0 || targetIdx >= slides.length) return slides

  const tempOrder = slides[idx].sort_order
  slides[idx].sort_order = slides[targetIdx].sort_order
  slides[targetIdx].sort_order = tempOrder

  const reordered = slides.sort((a, b) => a.sort_order - b.sort_order)
  memoryHeroSlides = reordered
  saveToStorage(STORAGE_KEYS.HERO_SLIDES, reordered)

  try {
    const supabase = createClient()
    await supabase.from('hero_slides').upsert([
      { id: slides[idx].id, sort_order: slides[idx].sort_order },
      { id: slides[targetIdx].id, sort_order: slides[targetIdx].sort_order },
    ])
  } catch (err) {
    console.warn('Supabase hero_slides reorder error:', err)
  }

  return reordered
}

// ============================================
// BANNERS API
// ============================================
const defaultBanners: BannerItem[] = [
  {
    id: 'banner-1',
    title: 'Precision Surgical Forceps Special Line',
    subtitle: 'German Stainless Steel Grade AISI 420/440 with 5-Year Rust Warranty',
    image_url: '/images/transact/image3_3812_2.jpg',
    link_url: '/categories/general-surgery',
    position: 'top',
    is_active: true,
    sort_order: 1,
  },
  {
    id: 'banner-2',
    title: 'ISO 13485:2016 Certified Cleanroom Packaging',
    subtitle: 'Direct OEM/ODM production for hospital networks & surgical distributors worldwide',
    image_url: '/images/transact/image0_3812_2.png',
    link_url: '/production',
    position: 'middle',
    is_active: true,
    sort_order: 2,
  },
]

export function getStoredBanners(): BannerItem[] {
  return getFromStorage<BannerItem[]>('transact_banners_v1', defaultBanners)
}

export function saveBanner(banner: BannerItem): BannerItem {
  const banners = [...getStoredBanners()]
  const existingIdx = banners.findIndex((b) => b.id === banner.id)
  if (existingIdx >= 0) {
    banners[existingIdx] = banner
  } else {
    banners.push(banner)
  }
  saveToStorage('transact_banners_v1', banners)
  return banner
}

export function deleteBanner(id: string): boolean {
  const banners = getStoredBanners().filter((b) => b.id !== id)
  saveToStorage('transact_banners_v1', banners)
  return true
}

export function moveBannerOrder(id: string, direction: 'up' | 'down'): BannerItem[] {
  const banners = [...getStoredBanners()].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
  const idx = banners.findIndex((b) => b.id === id)
  if (idx < 0) return banners

  const targetIdx = direction === 'up' ? idx - 1 : idx + 1
  if (targetIdx < 0 || targetIdx >= banners.length) return banners

  const tempOrder = banners[idx].sort_order || idx
  banners[idx].sort_order = banners[targetIdx].sort_order || targetIdx
  banners[targetIdx].sort_order = tempOrder

  const reordered = banners.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
  saveToStorage('transact_banners_v1', reordered)
  return reordered
}

// ============================================
// INQUIRIES & RFQ API
// ============================================
export function getStoredInquiries(): ContactInquiryItem[] {
  return getFromStorage<ContactInquiryItem[]>(STORAGE_KEYS.INQUIRIES, memoryInquiries)
}

export async function submitInquiry(inquiry: Omit<ContactInquiryItem, 'id' | 'status' | 'created_at'>): Promise<ContactInquiryItem> {
  const newInquiry: ContactInquiryItem = {
    ...inquiry,
    id: `inq-${Date.now()}`,
    status: 'new',
    created_at: new Date().toISOString(),
  }

  const current = getStoredInquiries()
  current.unshift(newInquiry)
  memoryInquiries = current
  saveToStorage(STORAGE_KEYS.INQUIRIES, current)

  try {
    const supabase = createClient()
    await supabase.from('contact_inquiries').insert({
      id: newInquiry.id,
      name: newInquiry.customer_name,
      email: newInquiry.email,
      phone: newInquiry.phone,
      company: newInquiry.company_name,
      message: newInquiry.message,
      subject: newInquiry.subject || 'Surgical Quote Request',
      status: 'new',
      created_at: newInquiry.created_at,
    })
  } catch (err) {
    console.warn('Supabase inquiry insert skipped:', err)
  }

  return newInquiry
}

export function updateInquiryStatus(id: string, status: ContactInquiryItem['status']): void {
  const current = getStoredInquiries().map((inq) =>
    inq.id === id ? { ...inq, status } : inq
  )
  memoryInquiries = current
  saveToStorage(STORAGE_KEYS.INQUIRIES, current)
}

export function deleteInquiry(id: string): void {
  const current = getStoredInquiries().filter((inq) => inq.id !== id)
  memoryInquiries = current
  saveToStorage(STORAGE_KEYS.INQUIRIES, current)
}

// ============================================
// STORE SETTINGS
// ============================================
export function getStoreSettings(): StoreSettings {
  return getFromStorage<StoreSettings>(STORAGE_KEYS.SETTINGS, memorySettings)
}

export function saveStoreSettings(settings: StoreSettings): StoreSettings {
  memorySettings = settings
  saveToStorage(STORAGE_KEYS.SETTINGS, settings)
  return settings
}

// ============================================
// QUOTE CART (RFQ DRAWER)
// ============================================
export function getQuoteCart(): QuoteCartItem[] {
  return getFromStorage<QuoteCartItem[]>(STORAGE_KEYS.QUOTE_CART, memoryQuoteCart)
}

export function addToQuoteCart(product: ProductItem, quantity: number = 1): QuoteCartItem[] {
  const cart = [...getQuoteCart()]
  const existing = cart.find((i) => i.id === product.id)
  if (existing) {
    existing.quantity += quantity
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      sku: product.sku || 'SKU-TRANS',
      image: product.featured_image || '/images/transact/image5_3812_2.jpg',
      category: product.category_name || 'Surgical Instruments',
      quantity,
    })
  }
  memoryQuoteCart = cart
  saveToStorage(STORAGE_KEYS.QUOTE_CART, cart)
  return cart
}

export function updateQuoteCartQuantity(productId: string, quantity: number): QuoteCartItem[] {
  let cart = getQuoteCart()
  if (quantity <= 0) {
    cart = cart.filter((i) => i.id !== productId)
  } else {
    cart = cart.map((i) => (i.id === productId ? { ...i, quantity } : i))
  }
  memoryQuoteCart = cart
  saveToStorage(STORAGE_KEYS.QUOTE_CART, cart)
  return cart
}

export function clearQuoteCart(): void {
  memoryQuoteCart = []
  saveToStorage(STORAGE_KEYS.QUOTE_CART, [])
}

// ============================================
// PRODUCT LINE SHOWCASE (ss 1)
// ============================================
const defaultProductLine: ProductLineShowcase = {
  title: 'Our Complete Product Line',
  subtitle:
    'Advanced Laryngoscopes Designed For Safe, Reliable, And Controlled Airway Management.\nImages Are For Illustrative Purposes Only.',
  tag: 'Reusable',
  item_title: 'Laryngoscopes',
  item_subtitle: 'Prioritising Ergonomic Design Enhancing Lives',
  button_text: 'Meet The Laryngoscope',
  button_link: '/products?category=laryngoscopes',
  image_url: '/Rectangle 819 (1).svg',
}

export function getStoredProductLine(): ProductLineShowcase {
  return getFromStorage<ProductLineShowcase>(STORAGE_KEYS.PRODUCT_LINE, defaultProductLine)
}

export function saveProductLine(data: ProductLineShowcase): ProductLineShowcase {
  saveToStorage(STORAGE_KEYS.PRODUCT_LINE, data)
  return data
}

// ============================================
// PROJECT DEVELOPMENT (ss 2)
// ============================================
const defaultProjectDev: ProjectDevelopmentSection = {
  features: [
    { icon: '/LED Illumination-icon 1.svg', title: 'White LED\nIllumination' },
    { icon: '/Batteries-icon 1.svg', title: 'Pre-inserted\nBatteries' },
    { icon: '/Precision Engineering-icon 1.svg', title: 'Durable\nConstruction' },
    { icon: '/Global Presence-icon 1.svg', title: 'Global\nPresence' },
    { icon: '/Skilled Craftsmanship-icon 1.svg', title: 'Skilled\nCraftsmanship' },
  ],
  eyebrow: 'EXPLORE PRODUCTS',
  title_main: 'New Products',
  title_highlight: 'Project Development',
  paragraphs: [
    'From Concept To Finished Product, Transact Provides Reliable Solutions Tailored To The Needs Of Healthcare Professionals, Distributors And Global Medical Brands.',
    'Our Expertise Covers Design, Prototyping, Forging & Machining, Material Selection, Heat Treatment, Finishing & Polishing, And Final Product Development.',
    'With A Broad Portfolio Of Laryngoscopes And Diagnostic Instruments, We Continuously Develop Solutions Focused On Performance, Durability And Clinical Usability.',
  ],
  button_text: 'Learn More',
  button_link: '/production',
  image_url: '/image 351 (1).svg',
  steps: [
    'Design & Concept',
    'Prototyping',
    'Forging & Machining',
    'Material Selection',
    'Finishing & Polishing',
    'Final Product Development',
  ],
}

export function getStoredProjectDev(): ProjectDevelopmentSection {
  return getFromStorage<ProjectDevelopmentSection>(STORAGE_KEYS.PROJECT_DEV, defaultProjectDev)
}

export function saveProjectDev(data: ProjectDevelopmentSection): ProjectDevelopmentSection {
  saveToStorage(STORAGE_KEYS.PROJECT_DEV, data)
  return data
}

// ============================================
// PRECISION MANUFACTURING & QUALITY CONTROL (ss 1)
// ============================================
const defaultPrecisionMfg: PrecisionManufacturingSection = {
  eyebrow: 'QUALITY & MANUFACTURING',
  title_line1: 'PrecisionManufacturing &',
  title_line2: 'Quality Control',
  subtitle_p1:
    'Every Transact Instrument Passes Through Carefully Controlled Manufacturing And Inspection Processes.',
  subtitle_p2: 'Our Production Workflow Includes:',
  image_url: '/image 352.svg',
  steps: [
    { icon: '/Material-icon 1 (1).svg', title: 'Material\nSelection' },
    { icon: '/Forging & Machining-icon 1 (1).svg', title: 'Forging &\nMachining' },
    { icon: '/Heat Treatment-icon 1.svg', title: 'Heat\nTreatment' },
    { icon: '/Finishing-Polishing-icon 1 (1).svg', title: 'Finishing &\nPolishing' },
    { icon: '/Assembly-icon 1.svg', title: 'Assembly' },
    { icon: '/Quality Control-icon 1.svg', title: 'Quality\nControl' },
    { icon: '/Packing & Sterilization-icon 1 (1).svg', title: 'Packing &\nSterilization' },
  ],
  footnote:
    'We Focus On Consistent Quality, Precise Finishing And Dependable Performance Across Every Product.',
}

export function getStoredPrecisionMfg(): PrecisionManufacturingSection {
  return getFromStorage<PrecisionManufacturingSection>(STORAGE_KEYS.PRECISION_MFG, defaultPrecisionMfg)
}

export function savePrecisionMfg(data: PrecisionManufacturingSection): PrecisionManufacturingSection {
  saveToStorage(STORAGE_KEYS.PRECISION_MFG, data)
  return data
}

// ============================================
// FAQS API
// ============================================
export function getStoredFaqs(): FaqItem[] {
  if (isBrowser()) {
    const fromStorage = getFromStorage<FaqItem[]>(STORAGE_KEYS.FAQS, [])
    if (fromStorage.length > 0) return fromStorage
    saveToStorage(STORAGE_KEYS.FAQS, memoryFaqs)
  }
  return memoryFaqs
}

export async function saveFaq(item: FaqItem): Promise<FaqItem> {
  const current = getStoredFaqs()
  const idx = current.findIndex((f) => f.id === item.id)
  let updated: FaqItem[]
  if (idx >= 0) {
    updated = [...current]
    updated[idx] = item
  } else {
    updated = [...current, item]
  }
  memoryFaqs = updated
  saveToStorage(STORAGE_KEYS.FAQS, updated)

  try {
    await fetch('/api/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save', faq: item }),
    })
  } catch (err) {
    console.error('Failed to sync FAQ to server:', err)
  }

  return item
}

export async function deleteFaq(id: string): Promise<void> {
  const current = getStoredFaqs()
  const updated = current.filter((f) => f.id !== id)
  memoryFaqs = updated
  saveToStorage(STORAGE_KEYS.FAQS, updated)

  try {
    await fetch('/api/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id }),
    })
  } catch (err) {
    console.error('Failed to delete FAQ on server:', err)
  }
}

