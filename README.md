# Transact International — Surgical Instruments Web Application & Admin Suite

Production-ready B2B platform for **Transact International**, medical and surgical instruments manufacturer and global exporter.

---

## 🌟 Key Features

### 1. Public Website
- **Modern Responsive Design**: Built strictly matching Figma designs with pixel-perfect layouts, responsive typography, and micro-interactions.
- **Product Showcase & Interactive Filtering**: Filter by Categories, Subcategories, and Models with dedicated search, breadcrumbs, and 3D preview cards.
- **Large Product View**: High-resolution image zoom, interactive specification tabs (rich formatting: bold, bullets, line breaks), dynamic specifications chart, and related products carousel with multi-image support.
- **Dynamic Catalogues**: 3D interactive book covers, PDF preview modal with in-app reader, category filters, and high-speed downloads.
- **Manufacturing Process**: Interactive step-by-step manufacturing pipeline (Forging, Milling, Heat Treatment, Passivation, Quality Inspection, Cleanroom Packing) with high-res illustrations and iconography.
- **Quality & Standards**: Detailed regulatory compliance showcase (ISO 13485:2016, CE MDR 2017/745, FDA QSR, ASTM F1089, DIN metallurgy).
- **Interactive FAQ Accordion**: 2-column organized FAQ with real-time expand/collapse and direct contact triggers.
- **Compliance & Legal Pages**: Complete Privacy Policy, Cookie Policy, and Terms of Use tailored for international medical device B2B procurement.

### 2. Admin Management Panel (`/admin`)
- **Product Management (`/admin/products`)**: Add, edit, delete products with multi-image placeholders, category selection, rich text specifications (bold, bullet, italic, newline), and customizable specs tables.
- **Catalogue Manager (`/admin/catalogues`)**: Upload high-resolution PDF catalogues and covers, manage categories, and inspect files in a built-in PDF viewer.
- **FAQ Manager (`/admin/faqs`)**: Full CRUD operations for frequently asked questions with instant preview.
- **Process Manager (`/admin/process`)**: Manage and customize each stage of the manufacturing process.
- **Category & Inquiry Management**: Live inquiry tracker and category management.

### 3. Database & Sync Architecture
- **Dual-Layer Persistence**: 
  - **Cloud Database (Supabase PostgreSQL)**: Remote real-time synchronization for products, inquiries, and assets.
  - **Local JSON Fallback (`src/data/`)**: Full offline resilience — if database connectivity is unavailable, the application seamlessly falls back to local data store without crashing.

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/arovisiontech/transact.git
cd transact
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://hhcehcdthzdssbperccd.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_HaCR6dev2Gf0vdfIjz-vig_q3HCpq30
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SITE_URL=https://transactintl.com
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` if port 3000 is occupied).

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🌐 Deploy to Vercel (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Import repository `arovisiontech/transact`.
3. Set **Framework Preset**: `Next.js`.
4. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL`
5. Click **Deploy**.

---

## 🛠 Tech Stack
- **Framework**: Next.js 16 (App Router + Turbopack + React 19)
- **Styling**: Tailwind CSS + Vanilla CSS Tokens
- **Icons**: Lucide React + Custom SVG Assets
- **Database**: Supabase (PostgreSQL) + Local JSON Fallback Store
- **Language**: TypeScript
