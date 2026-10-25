'use client'

import { createClient } from './supabase/client'
import {
  ProductItem,
  CategoryItem,
  CatalogueItem,
  HeroSlideItem,
  StoreSettings,
} from '@/src/types'

// Real-time synchronization helper for all devices
export async function fetchLiveHeroSlides(): Promise<HeroSlideItem[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error || !data || data.length === 0) {
      return []
    }

    return data.map((s) => ({
      id: s.id,
      title: s.title || '',
      subtitle: s.description || '',
      badge: s.eyebrow || 'ISO 13485:2016 CERTIFIED',
      image: s.image_url || '/image 333.svg',
      video_url: s.video_url || '',
      primaryCtaText: s.button_text || 'Request Institutional RFQ',
      primaryCtaLink: s.button_url || '/contact',
      secondaryCtaText: 'Browse Catalogues',
      secondaryCtaLink: '/catalogues',
      sort_order: s.sort_order || 1,
      is_active: s.is_active ?? true,
    }))
  } catch (err) {
    console.warn('Failed to fetch hero slides from Supabase:', err)
    return []
  }
}

export async function fetchLiveProducts(): Promise<ProductItem[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error || !data || data.length === 0) {
      return []
    }

    const cleanData = data.filter((p) => {
      const text = `${p.name || ''} ${p.title || ''} ${p.slug || ''} ${p.main_image_url || ''}`.toLowerCase()
      const isMotorcycle =
        text.includes('motorcycle') ||
        text.includes('glove') ||
        text.includes('jacket') ||
        text.includes('trouser') ||
        text.includes('carbon tech') ||
        text.includes('tourer') ||
        text.includes('roadster') ||
        text.includes('torque') ||
        text.includes('durable')
      return !isMotorcycle
    })

    return cleanData.map((p) => {
      // If full source_data was saved, restore it
      const src = p.source_data || {}
      return {
        id: p.id,
        category_id: p.category_id || src.category_id || null,
        category_name: src.category_name || 'General Surgery',
        subcategory_id: p.subcategory_id || src.subcategory_id || null,
        subcategory_name: src.subcategory_name || null,
        title: p.name || src.title || 'Precision Surgical Instrument',
        slug: p.slug || src.slug || `prod-${p.id}`,
        sku: p.sku || src.sku || 'TR-INS',
        price: p.price ?? src.price ?? 45,
        original_price: p.sale_price ? p.price : src.original_price,
        stock_quantity: p.stock_quantity ?? src.stock_quantity ?? 100,
        badge: src.badge || (p.is_new ? 'NEW' : p.is_featured ? 'FEATURED' : null),
        is_best_seller: src.is_best_seller ?? false,
        is_new_arrival: p.is_new ?? src.is_new_arrival ?? false,
        in_stock: p.is_active ?? true,
        is_featured: p.is_featured ?? src.is_featured ?? false,
        is_published: p.is_active ?? p.is_published ?? true,
        short_description: p.short_description || src.short_description || '',
        full_description: p.description || src.full_description || '',
        featured_image: p.main_image_url || src.featured_image || '/image 351 (1).svg',
        gallery_images: src.gallery_images || [p.main_image_url || '/image 351 (1).svg'],
        features: src.features || [
          'German Stainless Steel AISI 420/440',
          'Passivated & Ultrasonic Cleaned',
          'Autoclavable up to 134°C / 273°F',
        ],
        specifications: src.specifications || {
          Material: 'AISI 420 Japanese/German Steel',
          Finish: 'Satin Anti-Glare',
          Warranty: '5-Year Structural Integrity',
        },
        catalogue_pdf: p.catalogue_url || src.catalogue_pdf || '/catalogues/Artery-Forceps-Section4.pdf',
        sort_order: p.sort_order ?? src.sort_order ?? 1,
        created_at: p.created_at || src.created_at,
        updated_at: p.updated_at || src.updated_at,
      }
    })
  } catch (err) {
    console.warn('Failed to fetch products from Supabase:', err)
    return []
  }
}

export async function fetchLiveCategories(): Promise<CategoryItem[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error || !data || data.length === 0) {
      return []
    }

    return data.map((c) => {
      const src = c.source_data || {}
      return {
        id: c.id,
        name: c.name || src.name || 'Surgical Specialty',
        slug: c.slug || src.slug || `cat-${c.id}`,
        description: c.description || src.description || '',
        image_url: c.image_url || src.image_url || '/image 351 (1).svg',
        card_image: c.hover_image_url || src.card_image || '/Rectangle 819.svg',
        banner_url: c.banner_url || src.banner_url,
        icon: src.icon || null,
        sort_order: c.sort_order ?? src.sort_order ?? 1,
        is_published: c.is_active ?? src.is_published ?? true,
        is_active: c.is_active ?? src.is_active ?? true,
        is_featured: c.is_featured ?? src.is_featured ?? false,
        product_count: src.product_count ?? 12,
        created_at: c.created_at,
        updated_at: c.updated_at,
      }
    })
  } catch (err) {
    console.warn('Failed to fetch categories from Supabase:', err)
    return []
  }
}

export async function fetchLiveCatalogues(): Promise<CatalogueItem[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('catalogues')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error || !data || data.length === 0) {
      return []
    }

    return data.map((cat) => {
      const src = cat.source_data || {}
      return {
        id: cat.id,
        title: cat.title || src.title || 'Technical Surgical Catalogue',
        slug: src.slug || `cat-${cat.id}`,
        description: cat.description || src.description || '',
        cover_image: cat.cover_image_url || cat.thumbnail_url || src.cover_image || '/Rectangle 823.svg',
        pdf_url: cat.file_url || src.pdf_url || '/catalogues/Artery-Forceps-Section4.pdf',
        pages: src.pages || 48,
        file_size: src.file_size || '12.4 MB',
        is_published: cat.is_active ?? src.is_published ?? true,
        sort_order: cat.sort_order ?? src.sort_order ?? 1,
        created_at: cat.created_at,
        updated_at: cat.updated_at,
      }
    })
  } catch (err) {
    console.warn('Failed to fetch catalogues from Supabase:', err)
    return []
  }
}

// Subscribe to real-time changes on Supabase so all devices receive updates live
export function setupSupabaseRealtime(onUpdate: () => void) {
  if (typeof window === 'undefined') return () => {}

  try {
    const supabase = createClient()
    const channel = supabase
      .channel('transact_all_changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        onUpdate()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  } catch {
    return () => {}
  }
}
