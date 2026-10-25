export interface ProductImageItem {
  id?: string
  product_id?: string
  image_url: string
  alt_text?: string | null
  sort_order?: number
}

export interface ProductItem {
  id: string
  category_id: string | null
  category_name?: string | null
  subcategory_id?: string | null
  subcategory_name?: string | null
  title: string
  slug: string
  sku: string | null
  price?: number | null
  original_price?: number | null
  stock_quantity?: number
  badge?: string | null
  is_best_seller?: boolean
  is_new_arrival?: boolean
  in_stock?: boolean
  is_featured: boolean
  is_published: boolean
  short_description: string | null
  full_description: string | null
  featured_image: string | null
  gallery_images?: (ProductImageItem | string)[]
  features?: string[]
  specifications?: Record<string, string>
  catalogue_pdf?: string | null
  seo_title?: string | null
  material?: string | null
  product_type?: string | null
  specifications_markdown?: string | null
  chart_rows?: Array<{
    reference: string
    blade: string
    size: string
    weight: string
    length: string
  }>
  built_to_perform?: {
    heading?: string
    cards: Array<{
      title: string
      description: string
      link_text: string
      link_url: string
    }>
  }
  related_product_ids?: string[]
  custom_related_products?: Array<{
    id?: string
    title: string
    sku?: string
    image: string
    slug?: string
  }>
  sort_order: number
  created_at?: string
  updated_at?: string
}

export interface CategoryItem {
  id: string
  parent_id?: string | null
  parent_name?: string | null
  name: string
  slug: string
  description?: string | null
  image_url?: string | null
  card_image?: string | null
  banner_url?: string | null
  icon?: string | null
  sort_order: number
  is_published: boolean
  is_active?: boolean
  is_featured?: boolean
  product_count?: number
  created_at?: string
  updated_at?: string
  subcategories?: SubcategoryItem[]
}

export interface SubcategoryItem {
  id: string
  category_id: string
  category_name?: string
  name: string
  slug: string
  description?: string | null
  image_url?: string | null
  sort_order: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface CatalogueItem {
  id: string
  category_id?: string | null
  category_name?: string | null
  category?: string
  catalog_number?: string
  title: string
  slug?: string
  description?: string | null
  cover_image: string | null
  pdf_url: string
  pages?: number
  file_size?: string
  is_published: boolean
  sort_order: number
  created_at?: string
  updated_at?: string
}

export interface HeroSlideItem {
  id: string
  title: string
  subtitle: string
  badge?: string
  image: string
  video_url?: string
  primaryCtaText: string
  primaryCtaLink: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
  sort_order: number
  is_active: boolean
}

export interface BannerItem {
  id: string
  title: string
  subtitle?: string
  image_url: string
  link_url?: string
  position?: string
  is_active: boolean
  sort_order?: number
}

export interface ContactInquiryItem {
  id: string
  customer_name: string
  email: string
  phone?: string
  company_name?: string
  country?: string
  subject?: string
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  product_id?: string
  product_title?: string
  product_sku?: string
  quantity?: number
  items?: { id: string; title: string; sku: string; quantity: number }[]
  created_at: string
}

export interface StoreSettings {
  store_name: string
  tagline: string
  contact_email: string
  support_email: string
  sales_phone: string
  whatsapp_number: string
  factory_address: string
  city_country: string
  working_hours: string
  facebook_url?: string
  linkedin_url?: string
  instagram_url?: string
  twitter_url?: string
  youtube_url?: string
  iso_certified: boolean
  ce_certified: boolean
  fda_registered: boolean
}

export interface QuoteCartItem {
  id: string
  title: string
  sku: string
  image: string
  category: string
  quantity: number
}

export interface ProductLineShowcase {
  title: string
  subtitle: string
  tag: string
  item_title: string
  item_subtitle: string
  button_text: string
  button_link: string
  image_url: string
}

export interface ProjectDevelopmentFeature {
  icon: string
  title: string
}

export interface ProjectDevelopmentSection {
  features: ProjectDevelopmentFeature[]
  eyebrow: string
  title_main: string
  title_highlight: string
  paragraphs: string[]
  button_text: string
  button_link: string
  image_url: string
  steps: string[]
}

export interface ManufacturingWorkflowStep {
  icon: string
  title: string
}

export interface PrecisionManufacturingSection {
  eyebrow: string
  title_line1: string
  title_line2: string
  subtitle_p1: string
  subtitle_p2: string
  image_url: string
  steps: ManufacturingWorkflowStep[]
  footnote: string
}

export interface ManufacturingPillar {
  id: string
  title: string
  subtitle: string
  icon: string
}

export interface ManufacturingWorkflowCard {
  id: string
  step: string
  title: string
  description: string
  icon: string
}

export interface ManufacturingProductionStep {
  id: string
  step: string
  title: string
  description: string
  image: string
}

export interface ManufacturingStandardCard {
  id: string
  step: string
  title: string
  description: string
}

export interface ManufacturingData {
  hero: {
    badge: string
    title: string
    subtitle: string
    breadcrumbs: Array<{ label: string; href: string }>
    hero_image: string
  }
  intro: {
    tagline: string
    heading: string
    description: string
    pillars: ManufacturingPillar[]
  }
  workflow: {
    tagline: string
    heading: string
    subheading: string
    cards: ManufacturingWorkflowCard[]
  }
  production_steps: {
    tagline: string
    heading: string
    description: string
    counter: string
    steps: ManufacturingProductionStep[]
  }
  standards: {
    tagline: string
    heading: string
    cards: ManufacturingStandardCard[]
  }
  cta: {
    tagline: string
    heading: string
    highlight: string
    description: string
    email_text: string
    email_link: string
    whatsapp_text: string
    whatsapp_link: string
  }
}

export interface FaqItem {
  id: string
  category: string
  question: string
  answer: string
  sort_order?: number
  is_published?: boolean
}
