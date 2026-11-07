import {
  ProductItem,
  CategoryItem,
  SubcategoryItem,
  CatalogueItem,
  HeroSlideItem,
  BannerItem,
  ContactInquiryItem,
  StoreSettings,
  QuoteCartItem,
  ProductLineShowcase,
  PortfolioShowcaseCard,
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
import initialSubcategories from '@/src/data/subcategories.json'
import { createClient } from './supabase/client'

const STORAGE_KEYS = {
  PRODUCTS: 'transact_products_v5',
  CATEGORIES: 'transact_categories_v4',
  SUBCATEGORIES: 'transact_subcategories_v3',
  CATALOGUES: 'transact_catalogues_v3',
  HERO_SLIDES: 'transact_hero_slides_v3',
  BANNERS: 'transact_banners_v3',
  INQUIRIES: 'transact_inquiries_v3',
  SETTINGS: 'transact_settings_v3',
  QUOTE_CART: 'transact_quote_cart_v3',
  PRODUCT_LINE: 'transact_product_line_v3',
  PORTFOLIO_CARDS: 'transact_portfolio_cards_v4',
  OTOSCOPE_CARDS: 'transact_otoscope_cards_v4',
  FILTER_FACETS: 'transact_filter_facets_v3',
  PROJECT_DEV: 'transact_project_dev_v3',
  PRECISION_MFG: 'transact_precision_mfg_v3',
  FAQS: 'transact_faqs_v3',
  IMPACT_NUMBERS: 'transact_impact_numbers_v2',
  ABOUT_FACILITY: 'transact_about_facility_v2',
  TRUST_FEATURES: 'transact_trust_features_v2',
  GLOBAL_PARTNER: 'transact_global_partner_v2',
  LARYNGOSCOPE_EXPERTISE: 'transact_laryngoscope_expertise_v2',
  FOOTER_INFO: 'transact_footer_info_v2',
}

// In-Memory State Cache
let memoryProducts: ProductItem[] = initialProducts as unknown as ProductItem[]
let memoryCategories: CategoryItem[] = initialCategories as unknown as CategoryItem[]
let memorySubcategories: SubcategoryItem[] = initialSubcategories as unknown as SubcategoryItem[]
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

// ────────────────────────────────────────────
// PORTFOLIO SHOWCASE CARDS (ss 2 - Exactly 2 Categories)
// ────────────────────────────────────────────
export const defaultPortfolioCards: PortfolioShowcaseCard[] = [
  {
    id: 'card-reusable-laryngoscopes',
    tag: 'Reusable Airway Management',
    title: 'Reusable Laryngoscopes',
    subtitle:
      'Precision engineered German stainless steel blades and handles engineered for safe, controlled intubation.',
    image: '/Rectangle 819 (1).svg',
    badgeIcon: '/laryngoscope 2.svg',
    badgeBg: 'bg-white/95',
    buttonText: 'Explore Reusable Line',
    buttonLink: '/products?category=reusable-laryngoscopes',
    indexLabel: '01 / 02',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'card-single-use-laryngoscopes',
    tag: 'Sterile Disposable Solutions',
    title: 'Single Use Laryngoscopes',
    subtitle:
      'Sterile, single-patient use airway blades preventing cross-contamination in critical airway management.',
    image: '/image 352.svg',
    badgeIcon: '/laryngoscope 2.svg',
    badgeBg: 'bg-[#F6851F]',
    buttonText: 'Explore Single-Use Line',
    buttonLink: '/products?category=single-use-laryngoscopes',
    indexLabel: '02 / 02',
    sort_order: 2,
    is_active: true,
  },
]

export function getStoredProductLineCards(): PortfolioShowcaseCard[] {
  const cats = getStoredCategories().filter(
    (c) => (c.section === 'airway' || !c.section || c.section === 'section_1') && c.is_published !== false
  )
  if (cats.length > 0) {
    const total = cats.length
    return cats.map((cat, idx) => ({
      id: `card-${cat.id}`,
      tag: cat.name.toLowerCase().includes('single')
        ? 'Sterile Disposable Solutions'
        : 'Reusable Airway Management',
      title: cat.name,
      subtitle: cat.description || '',
      image: cat.card_image || cat.image_url || '/Rectangle 819 (1).svg',
      badgeIcon: '/laryngoscope 2.svg',
      badgeBg: cat.name.toLowerCase().includes('single') ? 'bg-[#F6851F]' : 'bg-white/95',
      buttonText: `Explore ${cat.name.replace(' Laryngoscopes', '')} Line`,
      buttonLink: `/products?category=${cat.slug}`,
      indexLabel: `0${idx + 1} / 0${total}`,
      sort_order: cat.sort_order || idx + 1,
      is_active: true,
    }))
  }
  const cards = getFromStorage<PortfolioShowcaseCard[]>(STORAGE_KEYS.PORTFOLIO_CARDS, defaultPortfolioCards)
  return cards && cards.length > 0 ? cards : defaultPortfolioCards
}

export function saveProductLineCards(cards: PortfolioShowcaseCard[]): PortfolioShowcaseCard[] {
  saveToStorage(STORAGE_KEYS.PORTFOLIO_CARDS, cards)
  return cards
}

export function saveProductLineCard(card: PortfolioShowcaseCard): PortfolioShowcaseCard {
  const cards = [...getStoredProductLineCards()]
  const idx = cards.findIndex((c) => c.id === card.id)
  if (idx >= 0) {
    cards[idx] = card
  } else {
    cards.push(card)
  }
  saveProductLineCards(cards)
  return card
}

export function deleteProductLineCard(id: string): PortfolioShowcaseCard[] {
  const cards = getStoredProductLineCards().filter((c) => c.id !== id)
  saveProductLineCards(cards)
  return cards
}

export function moveProductLineCardOrder(id: string, direction: 'up' | 'down'): PortfolioShowcaseCard[] {
  const cards = [...getStoredProductLineCards()]
  const idx = cards.findIndex((c) => c.id === id)
  if (idx < 0) return cards
  const targetIdx = direction === 'up' ? idx - 1 : idx + 1
  if (targetIdx < 0 || targetIdx >= cards.length) return cards

  const temp = cards[idx]
  cards[idx] = cards[targetIdx]
  cards[targetIdx] = temp

  // Re-number indexLabel & sort_order
  const updated = cards.map((c, i) => ({
    ...c,
    sort_order: i + 1,
    indexLabel: `0${i + 1} / 0${cards.length}`,
  }))
  saveProductLineCards(updated)
  return updated
}

// ────────────────────────────────────────────
// OTOSCOPE SHOWCASE CARDS (ss 3 - Exactly 2 Categories)
// ────────────────────────────────────────────
export const defaultOtoscopeCards: PortfolioShowcaseCard[] = [
  {
    id: 'card-diagnostic-sets',
    tag: 'Fiber-Optic & High-Resolution Optics',
    title: 'Diagnostic & Otoscopy Sets',
    subtitle:
      'Advanced LED & Xenon illumination with scratch-resistant optical lenses delivering pristine clinical visualization for ENT examinations.',
    image: '/image 351 (1).svg',
    badgeIcon: '/Diagnostics 2.svg',
    badgeBg: 'bg-[#F6851F]',
    buttonText: 'Explore Diagnostics Line',
    buttonLink: '/products?category=diagnostics',
    indexLabel: '01 / 02',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'card-pocket-otoscopes',
    tag: 'Pocket Diagnostic Airway Systems',
    title: 'Pocket Otoscopes',
    subtitle:
      'High-intensity fiber-optic illumination with precision multi-magnification lenses engineered for rapid, accurate clinical examinations.',
    image: '/Rectangle 839.svg',
    badgeIcon: '/Diagnostics 2.svg',
    badgeBg: 'bg-white/95',
    buttonText: 'Explore Otoscopy Line',
    buttonLink: '/products?category=pocket-otoscopes',
    indexLabel: '02 / 02',
    sort_order: 2,
    is_active: true,
  },
]

export function getStoredOtoscopeCards(): PortfolioShowcaseCard[] {
  const cats = getStoredCategories().filter(
    (c) => (c.section === 'diagnostics' || c.section === 'section_2') && c.is_published !== false
  )
  if (cats.length > 0) {
    const total = cats.length
    return cats.map((cat, idx) => ({
      id: `card-${cat.id}`,
      tag: cat.name.toLowerCase().includes('pocket')
        ? 'Pocket Diagnostic Airway Systems'
        : 'Fiber-Optic & High-Resolution Optics',
      title: cat.name,
      subtitle: cat.description || '',
      image: cat.card_image || cat.image_url || '/image 351 (1).svg',
      badgeIcon: '/Diagnostics 2.svg',
      badgeBg: 'bg-[#F6851F]',
      buttonText: `Explore ${cat.name.replace(' Sets', '')} Line`,
      buttonLink: `/products?category=${cat.slug}`,
      indexLabel: `0${idx + 1} / 0${total}`,
      sort_order: cat.sort_order || idx + 1,
      is_active: true,
    }))
  }
  const cards = getFromStorage<PortfolioShowcaseCard[]>(STORAGE_KEYS.OTOSCOPE_CARDS, defaultOtoscopeCards)
  return cards && cards.length > 0 ? cards : defaultOtoscopeCards
}

export function saveOtoscopeCards(cards: PortfolioShowcaseCard[]): PortfolioShowcaseCard[] {
  saveToStorage(STORAGE_KEYS.OTOSCOPE_CARDS, cards)
  return cards
}

export function saveOtoscopeCard(card: PortfolioShowcaseCard): PortfolioShowcaseCard {
  const cards = [...getStoredOtoscopeCards()]
  const idx = cards.findIndex((c) => c.id === card.id)
  if (idx >= 0) {
    cards[idx] = card
  } else {
    cards.push(card)
  }
  saveOtoscopeCards(cards)
  return card
}

export function deleteOtoscopeCard(id: string): PortfolioShowcaseCard[] {
  const cards = getStoredOtoscopeCards().filter((c) => c.id !== id)
  saveOtoscopeCards(cards)
  return cards
}

export function moveOtoscopeCardOrder(id: string, direction: 'up' | 'down'): PortfolioShowcaseCard[] {
  const cards = [...getStoredOtoscopeCards()]
  const idx = cards.findIndex((c) => c.id === id)
  if (idx < 0) return cards
  const targetIdx = direction === 'up' ? idx - 1 : idx + 1
  if (targetIdx < 0 || targetIdx >= cards.length) return cards

  const temp = cards[idx]
  cards[idx] = cards[targetIdx]
  cards[targetIdx] = temp

  const updated = cards.map((c, i) => ({
    ...c,
    sort_order: i + 1,
    indexLabel: `0${i + 1} / 0${cards.length}`,
  }))
  saveOtoscopeCards(updated)
  return updated
}

// ────────────────────────────────────────────
// SUBCATEGORIES API
// ────────────────────────────────────────────
export function getStoredSubcategories(): SubcategoryItem[] {
  if (isBrowser()) {
    const fromStorage = getFromStorage<SubcategoryItem[]>(STORAGE_KEYS.SUBCATEGORIES, [])
    if (fromStorage.length > 0) return fromStorage
    saveToStorage(STORAGE_KEYS.SUBCATEGORIES, memorySubcategories)
  }
  return memorySubcategories
}

export async function saveSubcategory(subcat: SubcategoryItem): Promise<SubcategoryItem> {
  const list = [...getStoredSubcategories()]
  const idx = list.findIndex((s) => s.id === subcat.id)
  const updated = {
    ...subcat,
    updated_at: new Date().toISOString(),
  }
  if (idx >= 0) {
    list[idx] = updated
  } else {
    list.push(updated)
  }
  memorySubcategories = list
  saveToStorage(STORAGE_KEYS.SUBCATEGORIES, list)

  if (isBrowser()) {
    try {
      await fetch('/api/subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', subcategory: updated }),
      })
    } catch (err) {
      console.warn('Failed to persist subcategory:', err)
    }
  }
  return updated
}

export async function deleteSubcategory(id: string): Promise<boolean> {
  const list = getStoredSubcategories().filter((s) => s.id !== id)
  memorySubcategories = list
  saveToStorage(STORAGE_KEYS.SUBCATEGORIES, list)

  if (isBrowser()) {
    try {
      await fetch('/api/subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      })
    } catch (err) {
      console.warn('Failed to delete subcategory:', err)
    }
  }
  return true
}

export function moveSubcategoryOrder(id: string, direction: 'up' | 'down'): SubcategoryItem[] {
  const list = [...getStoredSubcategories()]
  const idx = list.findIndex((s) => s.id === id)
  if (idx < 0) return list
  const targetIdx = direction === 'up' ? idx - 1 : idx + 1
  if (targetIdx < 0 || targetIdx >= list.length) return list

  const temp = list[idx]
  list[idx] = list[targetIdx]
  list[targetIdx] = temp

  const updated = list.map((s, i) => ({ ...s, sort_order: i + 1 }))
  memorySubcategories = updated
  saveToStorage(STORAGE_KEYS.SUBCATEGORIES, updated)

  if (isBrowser()) {
    fetch('/api/subcategories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'setAll', subcategories: updated }),
    }).catch((e) => console.warn(e))
  }
  return updated
}

// ────────────────────────────────────────────
// STORE FILTERS & FACETS API (ss 4)
// ────────────────────────────────────────────
export interface FilterFacets {
  productTypes: string[]
  materials: string[]
}

const defaultFilterFacets: FilterFacets = {
  productTypes: ['Macintosh Blades', 'Miller Blades', 'Conventional Single Use', 'Plastic / Fiber Optic'],
  materials: ['Stainless Steel', 'Fiber Optic'],
}

export function getStoredFilterFacets(): FilterFacets {
  return getFromStorage<FilterFacets>(STORAGE_KEYS.FILTER_FACETS, defaultFilterFacets)
}

export function saveFilterFacets(facets: FilterFacets): FilterFacets {
  saveToStorage(STORAGE_KEYS.FILTER_FACETS, facets)
  return facets
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

// ============================================
// HOME PAGE SECTIONS API (Section-by-Section)
// ============================================

export interface ImpactNumbersData {
  eyebrow: string
  eyebrow_accent: string
  tagline: string
  stats: {
    type: string
    icon: string
    value: string
    label: string
  }[]
}

const defaultImpactNumbers: ImpactNumbersData = {
  eyebrow: 'OUR IMPACT',
  eyebrow_accent: 'IN NUMBERS',
  tagline: 'Delivering Quality, Building Healthier Tomorrow.',
  stats: [
    {
      type: 'factory',
      icon: '/factory-icon 1.svg',
      value: '1800SQ +',
      label: 'Products Manufactured',
    },
    {
      type: 'worker',
      icon: '/Worker-icon 1.svg',
      value: '150+',
      label: 'Dedicated Professionals',
    },
    {
      type: 'global',
      icon: '/global-icon 1.svg',
      value: '80+',
      label: 'Global Presence In Countries',
    },
    {
      type: 'laryngoscope',
      icon: '/laryngoscope 2.svg',
      value: '100+',
      label: 'Products Range',
    },
  ],
}

export function getStoredImpactNumbers(): ImpactNumbersData {
  return getFromStorage<ImpactNumbersData>(STORAGE_KEYS.IMPACT_NUMBERS, defaultImpactNumbers)
}

export function saveImpactNumbers(data: ImpactNumbersData): ImpactNumbersData {
  saveToStorage(STORAGE_KEYS.IMPACT_NUMBERS, data)
  return data
}

// ── About & Facility Section (SS 1) ──
export interface AboutFacilityData {
  eyebrow: string
  title: string
  title_highlight: string
  paragraph_1: string
  paragraph_2: string
  checklist: string[]
  button_text: string
  button_link: string
  image_url: string
}

const defaultAboutFacility: AboutFacilityData = {
  eyebrow: 'Since 1990 — ISO 9001 & 13485 Certified',
  title: 'Global Manufacturer Of Laryngoscopes, Blades, And Airway Management Instruments',
  title_highlight: 'Laryngoscopes, Blades,',
  paragraph_1:
    'At Transact International, Quality Is Not Just A Standard — It Is Our Foundation. We Are Dedicated To Crafting Laryngoscope & Diagnostics Instruments That Embody Precision, Performance, And Trust. Every Product We Manufacture Undergoes Rigorous Inspection And Testing To Ensure It Meets The Highest International Benchmarks For Safety, Reliability, And Efficiency.',
  paragraph_2:
    'Our Commitment To Excellence Is Deeply Embedded In Every Stage Of Our Process, Ensuring That Healthcare Professionals Receive Instruments They Can Rely On With Complete Confidence.',
  checklist: [
    'State-of-the-art CNC Machining & Drop Forging Units',
    'Dedicated Passivation & Ultrasonic Decontamination Line',
    '100% Dimensional & Rockwell Hardness Testing (HRC 50-54)',
    'Class 10,000 Cleanroom Sterile Packing Facility',
    'Custom Laser Marking, Barcoding & UDI Tracking',
  ],
  button_text: 'About Us More',
  button_link: '/about',
  image_url: '/building-jpg 1.svg',
}

export function getStoredAboutFacility(): AboutFacilityData {
  return getFromStorage<AboutFacilityData>(STORAGE_KEYS.ABOUT_FACILITY, defaultAboutFacility)
}

export function saveAboutFacility(data: AboutFacilityData): AboutFacilityData {
  saveToStorage(STORAGE_KEYS.ABOUT_FACILITY, data)
  return data
}

// ── Trust & Quality Features Section ──
export interface TrustFeaturesData {
  eyebrow: string
  title: string
  subtitle: string
  features: {
    icon: string
    title: string
    description: string
  }[]
}

const defaultTrustFeatures: TrustFeaturesData = {
  eyebrow: 'Built For Safety. Designed For Excellence.',
  title: 'Quality You Can Trust, Every Time',
  subtitle:
    'From Raw Material To Final Inspection – Every Step Is Controlled, So You Can Focus On What Matters Most: Your Patients',
  features: [
    {
      icon: '/reusable-grade 1.svg',
      title: 'Premium Quality Materials',
      description:
        'High-Quality Materials Selected For Superior Durability, Precision, And Long-Lasting Performance.',
    },
    {
      icon: '/Inspection Process-icon 1.svg',
      title: 'Advanced Inspection Process',
      description:
        'Precision Testing And Detailed Inspections At Every Stage To Ensure Consistent Quality And Reliability.',
    },
    {
      icon: '/quality-icon 1 (1).svg',
      title: 'Certified Quality Systems',
      description:
        'Manufactured Under Internationally Recognized Quality Standards For Safety, Consistency, And Performance.',
    },
    {
      icon: '/factory-orange.svg',
      title: 'Modern Manufacturing',
      description:
        'Advanced Manufacturing Facilities Delivering High-Precision Instruments With Consistent Results.',
    },
    {
      icon: '/Global Presence-icon 1.svg',
      title: 'Global Presence',
      description:
        'Trusted By Healthcare Professionals And Partners Across Multiple Countries Worldwide.',
    },
  ],
}

export function getStoredTrustFeatures(): TrustFeaturesData {
  return getFromStorage<TrustFeaturesData>(STORAGE_KEYS.TRUST_FEATURES, defaultTrustFeatures)
}

export function saveTrustFeatures(data: TrustFeaturesData): TrustFeaturesData {
  saveToStorage(STORAGE_KEYS.TRUST_FEATURES, data)
  return data
}

// ── Global B2B Partnership Section ──
export interface GlobalPartnerData {
  eyebrow: string
  title: string
  title_highlight: string
  paragraph_1: string
  paragraph_2: string
  metrics: {
    value: string
    label: string
    icon: string
  }[]
  primary_btn_text: string
  primary_btn_link: string
  tag_1: string
  tag_2: string
}

const defaultGlobalPartner: GlobalPartnerData = {
  eyebrow: 'GLOBAL B2B PARTNERSHIP',
  title: 'Your Reliable Medical Instrument Partner',
  title_highlight: 'Instrument Partner',
  paragraph_1:
    'Transact Works With Healthcare Distributors, Hospitals, Medical Companies And Global Brands Seeking Dependable Laryngoscope Solutions.',
  paragraph_2:
    'With 50+ Countries Of Global Presence And 150+ Dedicated Professionals, We Offer Flexible OEM / Private Label Opportunities Tailored To Your Requirements.',
  metrics: [
    {
      value: '50+',
      label: 'Countries Global Presence',
      icon: '/Global Presence-icon 2.svg',
    },
    {
      value: '150+',
      label: 'Dedicated Professionals',
      icon: '/Dedicated Professionals-icon 1.svg',
    },
    {
      value: 'OEM / Private Label',
      label: 'Flexible Solutions',
      icon: '/Flexible Solutions-icon 1.svg',
    },
  ],
  primary_btn_text: 'Request Your Product',
  primary_btn_link: '/contact',
  tag_1: 'OEM / Private Label',
  tag_2: 'Global Distribution',
}

export function getStoredGlobalPartner(): GlobalPartnerData {
  return getFromStorage<GlobalPartnerData>(STORAGE_KEYS.GLOBAL_PARTNER, defaultGlobalPartner)
}

export function saveGlobalPartner(data: GlobalPartnerData): GlobalPartnerData {
  saveToStorage(STORAGE_KEYS.GLOBAL_PARTNER, data)
  return data
}

// ── Laryngoscope Expertise Section ──
export interface LaryngoscopeExpertiseData {
  eyebrow: string
  title: string
  description: string
  steps: string[]
}

const defaultLaryngoscopeExpertise: LaryngoscopeExpertiseData = {
  eyebrow: 'LARYNGOSCOPE EXPERTISE',
  title: 'BUILT FOR PRECISION & RELIABILITY',
  description:
    'Our Manufacturing Expertise Combines Advanced Production Techniques, Skilled Craftsmanship, Quality Materials, And Rigorous Inspection To Create Instruments That Meet The Demanding Requirements Of Healthcare Professionals, Hospitals, Distributors, And Global Medical Brands.',
  steps: [
    'Raw Material Selection',
    'Stamping And Forging',
    'CNC Machining And Milling',
    'Fiber Optic Integration',
    'Grinding And Polishing',
    'Passivation And Sterilization',
    'Quality Control And Testing',
  ],
}

export function getStoredLaryngoscopeExpertise(): LaryngoscopeExpertiseData {
  return getFromStorage<LaryngoscopeExpertiseData>(
    STORAGE_KEYS.LARYNGOSCOPE_EXPERTISE,
    defaultLaryngoscopeExpertise
  )
}

export function saveLaryngoscopeExpertise(data: LaryngoscopeExpertiseData): LaryngoscopeExpertiseData {
  saveToStorage(STORAGE_KEYS.LARYNGOSCOPE_EXPERTISE, data)
  return data
}

// ── Footer & Contact Info ──
export interface FooterInfoData {
  company_name: string
  address: string
  phones: string
  email: string
}

const defaultFooterInfo: FooterInfoData = {
  company_name: 'Transact International',
  address: 'Roras Road Muzaffar Pur, Sialkot - 51310 Pakistan.',
  phones: 'Phone: (+92) 345-2626832 | (+92) 52-3251700 | (+92) 52-3258989',
  email: 'info@transactintl.com',
}

export function getStoredFooterInfo(): FooterInfoData {
  return getFromStorage<FooterInfoData>(STORAGE_KEYS.FOOTER_INFO, defaultFooterInfo)
}

export function saveFooterInfo(data: FooterInfoData): FooterInfoData {
  saveToStorage(STORAGE_KEYS.FOOTER_INFO, data)
  return data
}

