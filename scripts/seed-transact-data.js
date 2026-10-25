const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 1. Categories
const alphaCats = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'alpha', 'src', 'data', 'categories.json'), 'utf8'));
const transactCats = alphaCats.map(cat => {
  return {
    ...cat,
    description: cat.description ? cat.description.replace(/Alpha Medical/gi, 'Transact International') : cat.description
  };
});
fs.writeFileSync(path.join(dataDir, 'categories.json'), JSON.stringify(transactCats, null, 2));
console.log(`Saved ${transactCats.length} categories.`);

// 2. Products
const alphaProds = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'alpha', 'src', 'data', 'products.json'), 'utf8'));
const transactProds = alphaProds.map(p => {
  const shortDesc = p.short_description ? p.short_description.replace(/Alpha Medical/gi, 'Transact International') : '';
  const fullDesc = p.full_description ? p.full_description.replace(/Alpha Medical/gi, 'Transact International') : '';
  return {
    ...p,
    short_description: shortDesc,
    full_description: fullDesc,
    seo_title: p.seo_title ? p.seo_title.replace(/Alpha Medical/gi, 'Transact International') : `${p.title} | Transact International`,
    seo_description: p.seo_description ? p.seo_description.replace(/Alpha Medical/gi, 'Transact International') : shortDesc
  };
});
fs.writeFileSync(path.join(dataDir, 'products.json'), JSON.stringify(transactProds, null, 2));
console.log(`Saved ${transactProds.length} products.`);

// 3. Catalogues
const alphaCatsPdf = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'alpha', 'src', 'data', 'catalogues.json'), 'utf8'));
const transactCatalogues = alphaCatsPdf.map(c => {
  return {
    ...c,
    description: c.description ? c.description.replace(/Alpha Medical/gi, 'Transact International') : ''
  };
});
fs.writeFileSync(path.join(dataDir, 'catalogues.json'), JSON.stringify(transactCatalogues, null, 2));
console.log(`Saved ${transactCatalogues.length} catalogues.`);

// 4. FAQs
const alphaFaqs = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'alpha', 'src', 'data', 'faqs.json'), 'utf8'));
const transactFaqs = alphaFaqs.map(f => {
  return {
    ...f,
    question: f.question.replace(/Alpha Medical Wholesale Supplies|Alpha Medical/gi, 'Transact International'),
    answer: f.answer.replace(/Alpha Medical Wholesale Supplies|Alpha Medical/gi, 'Transact International')
  };
});
fs.writeFileSync(path.join(dataDir, 'faqs.json'), JSON.stringify(transactFaqs, null, 2));
console.log(`Saved ${transactFaqs.length} FAQs.`);

// 5. Store Settings
const storeSettings = {
  store_name: "Transact International",
  tagline: "Precision Surgical & Medical Instruments Manufacturing",
  contact_email: "info@transactintl.com",
  support_email: "support@transactintl.com",
  sales_phone: "+92 52 3550123",
  whatsapp_number: "+92 300 1234567",
  factory_address: "Industrial Estate, Sambrial Road, Sialkot 51310, Pakistan",
  city_country: "Sialkot, Pakistan & Chicago, USA",
  working_hours: "Monday - Saturday: 8:00 AM - 6:00 PM (PKT)",
  facebook_url: "https://facebook.com/transactintl",
  linkedin_url: "https://linkedin.com/company/transactintl",
  instagram_url: "https://instagram.com/transactintl",
  youtube_url: "https://youtube.com/transactintl",
  iso_certified: true,
  ce_certified: true,
  fda_registered: true
};
fs.writeFileSync(path.join(dataDir, 'storeSettings.json'), JSON.stringify(storeSettings, null, 2));
console.log('Saved store settings.');

// 6. Hero Slides
const heroSlides = [
  {
    id: "slide-1",
    title: "Precision Surgical & Medical Instrument Manufacturing",
    subtitle: "Over 30 years of engineering excellence. Forged from German & Japanese stainless steel with ISO 13485 and CE certifications.",
    badge: "ISO 13485 & CE Certified",
    image: "/images/transact/image0_3812_2.png",
    primaryCtaText: "Explore Catalog",
    primaryCtaLink: "/products",
    secondaryCtaText: "Request Quote",
    secondaryCtaLink: "/contact",
    sort_order: 1,
    is_active: true
  },
  {
    id: "slide-2",
    title: "Global Export & OEM/ODM Surgical Solutions",
    subtitle: "Trusted by premier hospitals and distributors across 50+ countries. Custom laser engraving, sterile cleanroom packaging, and bulk supply.",
    badge: "Exporting to 50+ Countries",
    image: "/images/transact/image3_3812_2.png",
    primaryCtaText: "Download Catalogues",
    primaryCtaLink: "/catalogues",
    secondaryCtaText: "Factory Tour",
    secondaryCtaLink: "/production",
    sort_order: 2,
    is_active: true
  },
  {
    id: "slide-3",
    title: "Advanced Tungsten Carbide & Titanium Instruments",
    subtitle: "Gold-handled TC needle holders, micro-scissors, and ophthalmic titanium sets crafted for flawless surgical control.",
    badge: "DIN 1.4021 Stainless Steel",
    image: "/images/transact/image4_3812_2.png",
    primaryCtaText: "View TC Instruments",
    primaryCtaLink: "/categories/electro-tc",
    secondaryCtaText: "Custom Inquiries",
    secondaryCtaLink: "/contact",
    sort_order: 3,
    is_active: true
  }
];
fs.writeFileSync(path.join(dataDir, 'heroSlides.json'), JSON.stringify(heroSlides, null, 2));
console.log('Saved hero slides.');
