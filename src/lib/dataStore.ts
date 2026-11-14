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

export const PERMANENT_PURGED_PRODUCT_IDS = new Set<string>()
export const PERMANENT_PURGED_CATEGORY_IDS = new Set<string>()

const STORAGE_KEYS = {
  PRODUCTS: 'transact_products_v6',
  CATEGORIES: 'transact_categories_v6',
  DELETED_CATEGORIES: 'transact_deleted_categories_v1',
  DELETED_PRODUCTS: 'transact_deleted_products_v1',
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
  MANUFACTURING_PROCESS: 'transact_manufacturing_process_v2',
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

function saveToStorage<T>(key: string, value: T, notify: boolean = true): void {
  if (!isBrowser()) return
  try {
    localStorage.setItem(key, JSON.stringify(value))
    if (notify) {
      window.dispatchEvent(new Event('transact_data_updated'))
    }
  } catch (err) {
    console.error(`Failed to save to storage ${key}:`, err)
  }
}

let syncInitiated = false
let isSyncing = false
let lastSyncTimestamp = 0

export async function syncServerData(force = false): Promise<void> {
  if (!isBrowser() || isSyncing) return
  const now = Date.now()
  if (!force && now - lastSyncTimestamp < 30000) return
  isSyncing = true
  lastSyncTimestamp = now

  try {
    const [serverProdsRes, serverCatsRes, serverSubcatsRes, serverCatsLogRes, serverFaqsRes, serverMfgRes] = await Promise.all([
      fetch('/api/products', { cache: 'no-store' }).catch(() => null),
      fetch('/api/categories', { cache: 'no-store' }).catch(() => null),
      fetch('/api/subcategories', { cache: 'no-store' }).catch(() => null),
      fetch('/api/catalogues', { cache: 'no-store' }).catch(() => null),
      fetch('/api/faqs', { cache: 'no-store' }).catch(() => null),
      fetch('/api/manufacturing', { cache: 'no-store' }).catch(() => null),
    ])

    let hasAnyChanges = false

    // Helper to identify old placeholder SVGs so they never override real client photos
    const isPlaceholderImage = (img?: string | null) =>
      !img ||
      img === '/image-352.svg' ||
      img === '/image 352.svg' ||
      img === '/Rectangle-819-1.svg' ||
      img === '/Rectangle 819 (1).svg' ||
      img === '/image-351-1.svg'

    // 1. Sync Categories across all devices
    if (serverCatsRes && serverCatsRes.ok) {
      const serverCats = await serverCatsRes.json()
      if (Array.isArray(serverCats)) {
        const localCats = getFromStorage<CategoryItem[]>(STORAGE_KEYS.CATEGORIES, [])
        const deletedCatIds = new Set(getFromStorage<string[]>(STORAGE_KEYS.DELETED_CATEGORIES, []))

        const localMap = new Map<string, CategoryItem>()
        for (const cat of localCats) {
          if (!deletedCatIds.has(cat.id)) {
            localMap.set(cat.id, cat)
          }
        }

        const mergedMap = new Map<string, CategoryItem>()

        // Process server categories
        for (const sCat of serverCats) {
          if (deletedCatIds.has(sCat.id) || PERMANENT_PURGED_CATEGORY_IDS.has(sCat.id)) continue // Strictly exclude deleted categories

          const lCat = localMap.get(sCat.id)
          if (!lCat) {
            mergedMap.set(sCat.id, sCat)
          } else {
            // Local exists: preserve client's uploaded image and customizations
            const localHasCustom = !isPlaceholderImage(lCat.card_image) || !isPlaceholderImage(lCat.image_url)
            const localTime = new Date(lCat.updated_at || 0).getTime()
            const serverTime = new Date(sCat.updated_at || 0).getTime()

            if (localHasCustom || localTime >= serverTime) {
              mergedMap.set(sCat.id, {
                ...sCat,
                ...lCat,
                card_image: lCat.card_image && !isPlaceholderImage(lCat.card_image) ? lCat.card_image : lCat.image_url || sCat.card_image,
                image_url: lCat.image_url && !isPlaceholderImage(lCat.image_url) ? lCat.image_url : lCat.card_image || sCat.image_url,
              })
            } else {
              mergedMap.set(sCat.id, sCat)
            }
          }
        }

        // Add any newly created local categories
        for (const [id, lCat] of localMap.entries()) {
          if (PERMANENT_PURGED_CATEGORY_IDS.has(id)) continue
          if (!mergedMap.has(id)) {
            mergedMap.set(id, lCat)
          }
        }

        const unifiedCats = Array.from(mergedMap.values())
        if (JSON.stringify(unifiedCats) !== JSON.stringify(localCats)) {
          memoryCategories = unifiedCats
          saveToStorage(STORAGE_KEYS.CATEGORIES, unifiedCats, false)
          hasAnyChanges = true
        }
      }
    }

    // 2. Sync Subcategories across all devices
    if (serverSubcatsRes && serverSubcatsRes.ok) {
      const serverSubcats = await serverSubcatsRes.json()
      if (Array.isArray(serverSubcats) && serverSubcats.length > 0) {
        const localSubcats = getFromStorage<SubcategoryItem[]>(STORAGE_KEYS.SUBCATEGORIES, [])
        const serverSubIds = new Set(serverSubcats.map((s) => s.id))
        const unsyncedLocal = localSubcats.filter((s) => !serverSubIds.has(s.id))

        const unifiedSubcats = [...serverSubcats, ...unsyncedLocal]
        if (JSON.stringify(unifiedSubcats) !== JSON.stringify(localSubcats)) {
          memorySubcategories = unifiedSubcats
          saveToStorage(STORAGE_KEYS.SUBCATEGORIES, unifiedSubcats, false)
          hasAnyChanges = true
        }
      }
    }

    // 3. Sync Products intelligently (preserve user uploads & local edits!)
    if (serverProdsRes && serverProdsRes.ok) {
      const serverProds = await serverProdsRes.json()
      if (Array.isArray(serverProds)) {
        const localProds = getFromStorage<ProductItem[]>(STORAGE_KEYS.PRODUCTS, [])
        const deletedProdIds = new Set([
          ...Array.from(PERMANENT_PURGED_PRODUCT_IDS),
          ...getFromStorage<string[]>(STORAGE_KEYS.DELETED_PRODUCTS, []),
        ])

        const localMap = new Map<string, ProductItem>()
        for (const p of localProds) {
          if (!deletedProdIds.has(p.id) && !PERMANENT_PURGED_PRODUCT_IDS.has(p.id) && p.title !== 'test') {
            localMap.set(p.id, p)
          }
        }

        const mergedMap = new Map<string, ProductItem>()

        for (const sProd of serverProds) {
          if (deletedProdIds.has(sProd.id) || PERMANENT_PURGED_PRODUCT_IDS.has(sProd.id) || sProd.title === 'test') continue

          const lProd = localMap.get(sProd.id)
          if (!lProd) {
            mergedMap.set(sProd.id, sProd)
          } else {
            // Keep local changes if newer or if local has custom uploaded image / angles / related products
            const localTime = new Date(lProd.updated_at || 0).getTime()
            const serverTime = new Date(sProd.updated_at || 0).getTime()
            const localHasCustom = Boolean(
              (lProd.featured_image && (lProd.featured_image.startsWith('data:') || lProd.featured_image !== sProd.featured_image)) ||
              (lProd.gallery_images && lProd.gallery_images.length > 0) ||
              (lProd.custom_related_products && lProd.custom_related_products.length > 0)
            )

            if (localHasCustom || localTime >= serverTime) {
              mergedMap.set(sProd.id, {
                ...sProd,
                ...lProd,
                gallery_images: lProd.gallery_images && lProd.gallery_images.length > 0 ? lProd.gallery_images : sProd.gallery_images,
                custom_related_products: lProd.custom_related_products && lProd.custom_related_products.length > 0 ? lProd.custom_related_products : sProd.custom_related_products,
              })
            } else {
              mergedMap.set(sProd.id, sProd)
            }
          }
        }

        // Add any locally created products
        for (const [id, lProd] of localMap.entries()) {
          if (!mergedMap.has(id)) {
            mergedMap.set(id, lProd)
          }
        }

        const unifiedProds = Array.from(mergedMap.values())
        if (JSON.stringify(unifiedProds) !== JSON.stringify(localProds)) {
          memoryProducts = unifiedProds
          saveToStorage(STORAGE_KEYS.PRODUCTS, unifiedProds, false)
          hasAnyChanges = true
        }
      }
    }

    // 4. Sync Catalogues
    if (serverCatsLogRes && serverCatsLogRes.ok) {
      const catlog = await serverCatsLogRes.json()
      if (Array.isArray(catlog) && catlog.length > 0) {
        const localCatsLog = getFromStorage<CatalogueItem[]>(STORAGE_KEYS.CATALOGUES, [])
        if (JSON.stringify(catlog) !== JSON.stringify(localCatsLog)) {
          memoryCatalogues = catlog
          saveToStorage(STORAGE_KEYS.CATALOGUES, catlog, false)
          hasAnyChanges = true
        }
      }
    }

    // 5. Sync FAQs
    if (serverFaqsRes && serverFaqsRes.ok) {
      const faqs = await serverFaqsRes.json()
      if (Array.isArray(faqs) && faqs.length > 0) {
        const localFaqs = getFromStorage<FaqItem[]>(STORAGE_KEYS.FAQS, [])
        if (JSON.stringify(faqs) !== JSON.stringify(localFaqs)) {
          memoryFaqs = faqs
          saveToStorage(STORAGE_KEYS.FAQS, faqs, false)
          hasAnyChanges = true
        }
      }
    }

    // 6. Sync Manufacturing Process data
    if (serverMfgRes && serverMfgRes.ok) {
      const mfg = await serverMfgRes.json()
      if (mfg && mfg.hero) {
        const localMfg = getFromStorage<any>(STORAGE_KEYS.MANUFACTURING_PROCESS, null)
        if (JSON.stringify(mfg) !== JSON.stringify(localMfg)) {
          saveToStorage(STORAGE_KEYS.MANUFACTURING_PROCESS, mfg, false)
          hasAnyChanges = true
        }
      }
    }

    if (hasAnyChanges) {
      window.dispatchEvent(new Event('transact_data_updated'))
    }
  } catch (err) {
    console.warn('Cross-device background sync error:', err)
  } finally {
    isSyncing = false
  }
}

export async function initLiveSupabase(): Promise<void> {
  if (!isBrowser() || syncInitiated) return
  syncInitiated = true

  // Immediately run server data sync
  await syncServerData()

  // Set up periodic & event-driven auto-sync across all tabs and devices
  window.addEventListener('focus', () => syncServerData())
  window.addEventListener('online', () => syncServerData(true))
  setInterval(() => syncServerData(), 60000)

  try {
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

    // Purge unwanted dummy products from Supabase permanently
    try {
      const supabase = createClient()
      await supabase.from('products').delete().in('id', Array.from(PERMANENT_PURGED_PRODUCT_IDS))
    } catch {}

    // Setup listener so any other computer or mobile device updates in real time
    setupSupabaseRealtime(async () => {
      await syncServerData()
    })
  } catch (err) {
    console.warn('Initial Supabase live sync skipped or offline:', err)
  }
}

// Auto-trigger on client
if (isBrowser()) {
  setTimeout(() => {
    try {
      localStorage.removeItem('transact_products_v3')
      localStorage.removeItem('transact_deleted_products_v3')
    } catch {}
    initLiveSupabase()
  }, 50)
}


// ============================================
// PRODUCTS API
// ============================================
export function getStoredProducts(): ProductItem[] {
  if (isBrowser()) {
    const deletedProdIds = new Set([
      ...Array.from(PERMANENT_PURGED_PRODUCT_IDS),
      ...getFromStorage<string[]>(STORAGE_KEYS.DELETED_PRODUCTS, []),
    ])
    const fromStorage = getFromStorage<ProductItem[]>(STORAGE_KEYS.PRODUCTS, [])
    const sourceList = fromStorage.length > 0 ? fromStorage : memoryProducts

    const clean = sourceList
      .filter((p) => {
        if (!p || !p.id) return false
        if (deletedProdIds.has(p.id)) return false
        if (PERMANENT_PURGED_PRODUCT_IDS.has(p.id)) return false
        if (p.title === 'test' || p.title === ': test') return false
        // Filter out empty / broken placeholder cards without title
        if (!p.title || p.title.trim() === '') return false

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
      .map((p) => {
        let featured_image = p.featured_image
        if (!featured_image || featured_image.trim() === '' || featured_image.includes('image 352') || featured_image.includes('image-352')) {
          if (p.sku === 'TI-FRL-200' || (p.title || '').toLowerCase().includes('flexible tip')) {
            featured_image = '/images/transact/image2_3812_2.png'
          } else {
            featured_image = '/images/products/disposable-sterile-blade.jpg'
          }
        }
        return { ...p, featured_image }
      })

    if (clean.length !== fromStorage.length) {
      saveToStorage(STORAGE_KEYS.PRODUCTS, clean, false)
    }
    return clean
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

  // Remove from deleted list if present
  if (isBrowser()) {
    const deletedProds = getFromStorage<string[]>(STORAGE_KEYS.DELETED_PRODUCTS, [])
    if (deletedProds.includes(updatedProduct.id)) {
      saveToStorage(
        STORAGE_KEYS.DELETED_PRODUCTS,
        deletedProds.filter((id) => id !== updatedProduct.id)
      )
    }
  }

  memoryProducts = prods
  saveToStorage(STORAGE_KEYS.PRODUCTS, prods)

  // If hero_banner is set and category exists, also sync hero_banner to category banner_url
  if (isBrowser() && updatedProduct.hero_banner && updatedProduct.category_id) {
    try {
      const cats = [...getStoredCategories()]
      const catIdx = cats.findIndex((c) => c.id === updatedProduct.category_id)
      if (catIdx >= 0) {
        cats[catIdx] = {
          ...cats[catIdx],
          banner_url: updatedProduct.hero_banner,
          updated_at: new Date().toISOString(),
        }
        memoryCategories = cats
        saveToStorage(STORAGE_KEYS.CATEGORIES, cats)
        fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'setAll', categories: cats }),
        }).catch(() => {})
      }
    } catch {}
  }

  // Persist directly to server JSON file for cross-device & refresh persistence
  if (isBrowser()) {
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setAll', products: prods }),
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

  // Track deleted product so it doesn't get re-added on server sync
  if (isBrowser()) {
    const deletedProds = getFromStorage<string[]>(STORAGE_KEYS.DELETED_PRODUCTS, [])
    if (!deletedProds.includes(id)) {
      deletedProds.push(id)
      saveToStorage(STORAGE_KEYS.DELETED_PRODUCTS, deletedProds)
    }
  }

  // Persist deletion directly to server JSON file
  if (isBrowser()) {
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setAll', products: prods }),
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
    const deletedCatIds = new Set(getFromStorage<string[]>(STORAGE_KEYS.DELETED_CATEGORIES, []))
    const fromStorage = getFromStorage<CategoryItem[]>(STORAGE_KEYS.CATEGORIES, [])
    if (fromStorage.length > 0) {
      const clean = fromStorage.filter((c) => !deletedCatIds.has(c.id) && !PERMANENT_PURGED_CATEGORY_IDS.has(c.id))
      return clean
    }
    const cleanMemory = memoryCategories.filter((c) => !deletedCatIds.has(c.id) && !PERMANENT_PURGED_CATEGORY_IDS.has(c.id))
    saveToStorage(STORAGE_KEYS.CATEGORIES, cleanMemory)
    return cleanMemory
  }
  return memoryCategories.filter((c) => !PERMANENT_PURGED_CATEGORY_IDS.has(c.id))
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

  // Remove from deleted list if present
  if (isBrowser()) {
    const deletedCats = getFromStorage<string[]>(STORAGE_KEYS.DELETED_CATEGORIES, [])
    if (deletedCats.includes(updatedCategory.id)) {
      saveToStorage(
        STORAGE_KEYS.DELETED_CATEGORIES,
        deletedCats.filter((id) => id !== updatedCategory.id)
      )
    }
  }

  memoryCategories = cats
  saveToStorage(STORAGE_KEYS.CATEGORIES, cats)

  // Persist category to server JSON file
  if (isBrowser()) {
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setAll', categories: cats }),
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

  // Track deleted category so it doesn't get re-added on server sync
  if (isBrowser()) {
    const deletedCats = getFromStorage<string[]>(STORAGE_KEYS.DELETED_CATEGORIES, [])
    if (!deletedCats.includes(id)) {
      deletedCats.push(id)
      saveToStorage(STORAGE_KEYS.DELETED_CATEGORIES, deletedCats)
    }
  }

  // Persist category deletion to server JSON file
  if (isBrowser()) {
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setAll', categories: cats }),
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
    image_url: '/images/transact/image3_3812_2.png',
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
  const cart = getFromStorage<QuoteCartItem[]>(STORAGE_KEYS.QUOTE_CART, memoryQuoteCart)
  return Array.isArray(cart) ? cart : []
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
// PRODUCT LINE SHOWCASE
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
// PORTFOLIO SHOWCASE CARDS (Airway Management)
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
  const cats = (getStoredCategories() || []).filter(
    (c) => Boolean(c) && (c.section === 'airway' || !c.section || c.section === 'section_1') && c.is_published !== false
  )
  if (cats.length > 0) {
    const total = cats.length
    return cats.map((cat, idx) => {
      const catName = cat?.name || 'Airway Product'
      return {
        id: `card-${cat?.id || idx}`,
        tag: catName.toLowerCase().includes('single')
          ? 'Sterile Disposable Solutions'
          : 'Reusable Airway Management',
        title: catName,
        subtitle: cat?.description || '',
        image: cat?.card_image || cat?.image_url || '/Rectangle-819-1.svg',
        badgeIcon: '/laryngoscope-2.svg',
        badgeBg: catName.toLowerCase().includes('single') ? 'bg-[#F6851F]' : 'bg-white/95',
        buttonText: `Explore ${catName.replace(' Laryngoscopes', '')} Line`,
        buttonLink: `/products?category=${cat?.slug || ''}`,
        indexLabel: `0${idx + 1} / 0${total}`,
        sort_order: cat?.sort_order || idx + 1,
        is_active: true,
      }
    })
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
// OTOSCOPE SHOWCASE CARDS (Diagnostics & Otoscopy)
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
  const cats = (getStoredCategories() || []).filter(
    (c) => Boolean(c) && (c.section === 'diagnostics' || c.section === 'section_2') && c.is_published !== false
  )
  if (cats.length > 0) {
    const total = cats.length
    return cats.map((cat, idx) => {
      const catName = cat?.name || 'Diagnostic Instrument'
      return {
        id: `card-${cat?.id || idx}`,
        tag: catName.toLowerCase().includes('pocket')
          ? 'Pocket Diagnostic Airway Systems'
          : 'Fiber-Optic & High-Resolution Optics',
        title: catName,
        subtitle: cat?.description || '',
        image: cat?.card_image || cat?.image_url || '/image 351 (1).svg',
        badgeIcon: '/Diagnostics 2.svg',
        badgeBg: 'bg-[#F6851F]',
        buttonText: `Explore ${catName.replace(' Sets', '')} Line`,
        buttonLink: `/products?category=${cat?.slug || ''}`,
        indexLabel: `0${idx + 1} / 0${total}`,
        sort_order: cat?.sort_order || idx + 1,
        is_active: true,
      }
    })
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
// STORE FILTERS & FACETS API
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
// PROJECT DEVELOPMENT
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
// PRECISION MANUFACTURING & QUALITY CONTROL
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
  const stored = getFromStorage<any>(STORAGE_KEYS.PRECISION_MFG, null)
  if (
    stored &&
    Array.isArray(stored.steps) &&
    stored.steps.length > 0 &&
    typeof stored.steps[0]?.icon === 'string' &&
    stored.steps[0].icon.length > 0
  ) {
    return stored
  }
  // Self-heal corrupted localStorage entry from previous bug
  if (isBrowser() && stored) {
    try {
      localStorage.removeItem(STORAGE_KEYS.PRECISION_MFG)
    } catch {}
  }
  return defaultPrecisionMfg
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

// ── About & Facility Section ──
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

export const defaultGlobalPartner: GlobalPartnerData = {
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
      icon: '/global-presence-icon-2.svg',
    },
    {
      value: '150+',
      label: 'Dedicated Professionals',
      icon: '/worker-icon-1.svg',
    },
    {
      value: 'OEM / Private Label',
      label: 'Flexible Solutions',
      icon: '/asset-27-1.svg',
    },
  ],
  primary_btn_text: 'Request Your Product',
  primary_btn_link: '/contact',
  tag_1: 'OEM / Private Label',
  tag_2: 'Global Distribution',
}

export function getStoredGlobalPartner(): GlobalPartnerData {
  try {
    const data = getFromStorage<GlobalPartnerData>(STORAGE_KEYS.GLOBAL_PARTNER, defaultGlobalPartner)
    if (data && Array.isArray(data.metrics)) {
      data.metrics = data.metrics.map((m, idx) => {
        let icon = typeof m?.icon === 'string' ? m.icon : ''
        if (!icon || icon.includes('Dedicated Professionals') || icon.includes('undefined') || icon.includes('Worker-icon 1')) {
          icon = idx === 1 ? '/worker-icon-1.svg' : icon
        }
        if (!icon || icon.includes('Flexible Solutions') || icon.includes('undefined') || icon.includes('Asset 27 1')) {
          icon = idx === 2 ? '/asset-27-1.svg' : icon
        }
        if (!icon || icon.includes('undefined') || icon.includes('Global Presence-icon 2')) {
          icon = idx === 0 ? '/global-presence-icon-2.svg' : icon
        }
        return { ...m, icon: icon || (idx === 0 ? '/global-presence-icon-2.svg' : idx === 1 ? '/worker-icon-1.svg' : '/asset-27-1.svg') }
      })
    }
    return data || defaultGlobalPartner
  } catch (err) {
    console.warn('Error reading global partner, using default:', err)
    return defaultGlobalPartner
  }
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

