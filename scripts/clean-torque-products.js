const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
});

const key = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, key);

// Authentic Transact Precision Surgical Instruments
const cleanSurgicalProducts = [
  {
    id: 'prod-kelly-forceps-14cm',
    title: 'Hemostatic Kelly Forceps 14cm Curved',
    slug: 'hemostatic-kelly-forceps-14cm-curved',
    sku: 'TR-KF-140',
    category_id: 'cat-surg-inst',
    category_name: 'General Surgery',
    price: 34.50,
    badge: 'HOSPITAL STANDARD',
    is_best_seller: true,
    is_new_arrival: false,
    in_stock: true,
    is_featured: true,
    is_published: true,
    short_description: 'Precision forged hemostatic artery forceps with serrated jaws and ratchet lock.',
    full_description: 'Manufactured from premium AISI 420 surgical grade stainless steel. Precision calibrated box-lock joint ensures smooth actuation without jaw wobble during vessel clamping.',
    featured_image: '/images/transact/image5_3812_2.jpg',
    gallery_images: [
      '/images/transact/image5_3812_2.jpg',
      '/image 351 (1).svg',
      '/image 352.svg'
    ],
    features: ['German Rockwell Hardness HRC 50-54', 'Atraumatic Serrations', 'Autoclave Safe to 134°C', 'Box-Lock Mechanism'],
    specifications: { 'Length': '140mm (5.5")', 'Material': 'AISI 420 Surgical Stainless Steel', 'Pattern': 'Curved Serrated', 'Locking': 'Multi-Position Ratchet' }
  },
  {
    id: 'prod-metzenbaum-scissors-18cm',
    title: 'Metzenbaum Dissecting Scissors 18cm TC Curved',
    slug: 'metzenbaum-dissecting-scissors-18cm-tc-curved',
    sku: 'TR-MS-180',
    category_id: 'cat-electro-tc',
    category_name: 'Tungsten Carbide (TC)',
    price: 68.00,
    badge: 'GOLD HANDLE TC',
    is_best_seller: true,
    is_new_arrival: true,
    in_stock: true,
    is_featured: true,
    is_published: true,
    short_description: 'Tungsten carbide tipped dissecting scissors with gold-plated ring handles.',
    full_description: 'Micro-ground razor sharp cutting edges reinforced with sintered tungsten carbide inserts (HRC 64-68). Engineered for clean dissection of delicate tissue with minimal trauma.',
    featured_image: '/images/transact/image6_3812_2.jpg',
    gallery_images: [
      '/images/transact/image6_3812_2.jpg',
      '/image 353.svg',
      '/image 351 (1).svg'
    ],
    features: ['Sintered Tungsten Carbide Inserts', 'Gold-Plated Handle Identification', 'Ultra-Fine Micro Polish', 'Extended Edge Retention'],
    specifications: { 'Length': '180mm (7")', 'Blade Type': 'Curved Blunt/Blunt', 'Hardness': 'HRC 66', 'Finish': 'Satin Anti-Glare' }
  },
  {
    id: 'prod-castroviejo-needle-holder-14cm',
    title: 'Castroviejo Micro Needle Holder 14cm Straight',
    slug: 'castroviejo-micro-needle-holder-14cm-straight',
    sku: 'TR-NH-140',
    category_id: 'cat-cardio',
    category_name: 'Cardiovascular & Micro',
    price: 85.00,
    badge: 'PRECISION MICRO',
    is_best_seller: false,
    is_new_arrival: true,
    in_stock: true,
    is_featured: true,
    is_published: true,
    short_description: 'Spring-action micro needle holder with fine diamond-dusted TC jaws.',
    full_description: 'Specially calibrated spring tension and ergonomic knurled round handle for delicate microsurgical suture manipulation (5-0 to 8-0 sutures) in ophthalmic and vascular surgeries.',
    featured_image: '/images/transact/image7_3812_2.jpg',
    gallery_images: [
      '/images/transact/image7_3812_2.jpg',
      '/image 352.svg'
    ],
    features: ['Diamond-Dusted Micro Jaws', 'Spring Catch Lock', 'Ergonomic Round Knurled Handle', 'Ultra Lightweight Balance'],
    specifications: { 'Length': '140mm (5.5")', 'Suture Range': '5-0 to 8-0', 'Jaw Surface': 'Diamond Dust Grip', 'Catch': 'Positive Engagement Catch' }
  },
  {
    id: 'prod-laryngoscope-macintosh-set',
    title: 'Fiber Optic Laryngoscope Set Macintosh Blades',
    slug: 'fiber-optic-laryngoscope-set-macintosh',
    sku: 'TR-LR-MAC',
    category_id: 'cat-anesthesia',
    category_name: 'Diagnostic & Anesthesia',
    price: 195.00,
    badge: 'FIBER OPTIC 3.5V',
    is_best_seller: true,
    is_new_arrival: false,
    in_stock: true,
    is_featured: true,
    is_published: true,
    short_description: 'Complete green system fiber optic laryngoscope kit with 4 curved blades and LED handle.',
    full_description: 'German optical fiber bundle with high-transmission light conduit. Includes Macintosh blades sizes 1, 2, 3, and 4 in a heavy-duty padded protective transport case.',
    featured_image: '/laryngoscope 2.svg',
    gallery_images: [
      '/laryngoscope 2.svg',
      '/Diagnostics 2.svg',
      '/images/transact/image8_3812_2.jpg'
    ],
    features: ['Integrated Green Spec ISO 7376-3', 'Removable Fiber Core', 'High Output LED Handle', 'Autoclavable Blades'],
    specifications: { 'Blades Included': 'Macintosh 1, 2, 3, 4', 'Handle': 'Knurled 3.5V C-Size Battery Handle', 'Core': '4.0mm High Density Glass Fiber' }
  },
  {
    id: 'prod-mayo-dissecting-scissors-15cm',
    title: 'Mayo Dissecting Scissors 15cm Straight',
    slug: 'mayo-dissecting-scissors-15cm-straight',
    sku: 'TR-SC-150',
    category_id: 'cat-surg-inst',
    category_name: 'General Surgery',
    price: 29.00,
    badge: 'GENERAL SURGERY',
    is_best_seller: false,
    is_new_arrival: false,
    in_stock: true,
    is_featured: true,
    is_published: true,
    short_description: 'Heavy pattern surgical dissecting scissors for cutting fascia and dense tissue.',
    full_description: 'Beveled cutting blades manufactured from tempered 420 stainless steel for cutting heavy connective tissue, sutures, and surgical drapes.',
    featured_image: '/images/transact/image9_3812_2.jpg',
    gallery_images: [
      '/images/transact/image9_3812_2.jpg',
      '/image 351 (1).svg'
    ],
    features: ['Heavy Beveled Blades', 'Hand-Lapped Cutting Edge', 'Passivated Corrosion Resistance'],
    specifications: { 'Length': '150mm (6")', 'Blade Shape': 'Straight Heavy', 'Material': 'Martensitic Stainless Steel' }
  },
  {
    id: 'prod-adson-tissue-forceps-12cm',
    title: 'Adson Tissue Forceps 12cm 1x2 Teeth TC',
    slug: 'adson-tissue-forceps-12cm-tc',
    sku: 'TR-AD-120',
    category_id: 'cat-electro-tc',
    category_name: 'Tungsten Carbide (TC)',
    price: 42.00,
    badge: 'GOLD HANDLE TC',
    is_best_seller: true,
    is_new_arrival: false,
    in_stock: true,
    is_featured: true,
    is_published: true,
    short_description: 'Tungsten carbide fine tip tissue grasping forceps with 1x2 interlocking teeth.',
    full_description: 'Features a wide fluted grip for fingertip stability during delicate plastic, cosmetic, and general surgical skin closure.',
    featured_image: '/images/transact/image10_3812_2.jpg',
    gallery_images: [
      '/images/transact/image10_3812_2.jpg',
      '/image 353.svg'
    ],
    features: ['1x2 Interlocking Teeth', 'Tungsten Carbide Grip Pad', 'Wide Fluted Thumb Plate'],
    specifications: { 'Length': '120mm (4.75")', 'Teeth': '1x2 Fine Interlocking', 'Handle': 'Fluted Spring Shank' }
  },
  {
    id: 'prod-langbeck-retractor-set',
    title: 'Langenbeck Deep Tissue Retractor 21cm',
    slug: 'langenbeck-deep-tissue-retractor-21cm',
    sku: 'TR-RT-210',
    category_id: 'cat-surg-inst',
    category_name: 'General Surgery',
    price: 38.00,
    badge: 'HOSPITAL STANDARD',
    is_best_seller: false,
    is_new_arrival: false,
    in_stock: true,
    is_featured: true,
    is_published: true,
    short_description: 'Right-angle flat blade retractor with ergonomic teardrop ring handle.',
    full_description: 'Designed for deep retraction of soft tissue, muscles, and wound margins during abdominal and orthopedic procedures.',
    featured_image: '/images/transact/image5_3812_2.jpg',
    gallery_images: ['/images/transact/image5_3812_2.jpg'],
    features: ['Atraumatic Polished Edge', 'Teardrop Fenestrated Grip', 'Rigid Blade Geometry'],
    specifications: { 'Length': '210mm', 'Blade Size': '45mm x 15mm', 'Finish': 'Mirror Polish' }
  },
  {
    id: 'prod-liston-bone-cutting-forceps',
    title: 'Liston Bone Cutting Forceps 19cm Straight',
    slug: 'liston-bone-cutting-forceps-19cm',
    sku: 'TR-BF-190',
    category_id: 'cat-ortho',
    category_name: 'Orthopedic',
    price: 92.00,
    badge: 'HEAVY ORTHOPEDIC',
    is_best_seller: true,
    is_new_arrival: true,
    in_stock: true,
    is_featured: true,
    is_published: true,
    short_description: 'Double-action heavy bone shears for orthopedic osteotomy and resection.',
    full_description: 'Compound double-spring action multiplies grip force to slice through dense cortical bone cleanly with minimal hand fatigue.',
    featured_image: '/images/transact/image7_3812_2.jpg',
    gallery_images: ['/images/transact/image7_3812_2.jpg', '/image 352.svg'],
    features: ['Double-Action Force Multiplier', 'Hardened Carbon-Steel Cutting Jaws', 'Internal Leaf Springs'],
    specifications: { 'Length': '190mm (7.5")', 'Action': 'Double Hinge Compound', 'Hardness': 'HRC 58-60' }
  }
];

async function run() {
  console.log('Connecting to Supabase...');
  
  // 1. Fetch all products from Supabase
  const { data: allProds, error: fetchErr } = await supabase.from('products').select('*');
  if (fetchErr) {
    console.error('Fetch error:', fetchErr);
  } else {
    console.log('Total products currently in Supabase:', allProds.length);

    // Identify all motorcycle or non-surgical products
    const motorcycleIds = [];
    allProds.forEach(p => {
      const text = `${p.name || ''} ${p.title || ''} ${p.slug || ''} ${p.description || ''} ${p.main_image_url || ''}`.toLowerCase();
      if (
        text.includes('glove') ||
        text.includes('motorcycle') ||
        text.includes('carbon tech') ||
        text.includes('adventure') ||
        text.includes('trouser') ||
        text.includes('boot') ||
        text.includes('suit') ||
        text.includes('summer') ||
        text.includes('cooler') ||
        text.includes('colombo') ||
        text.includes('worker') ||
        text.includes('dakota') ||
        text.includes('guard') ||
        text.includes('harley') ||
        text.includes('ranger') ||
        text.includes('qubec') ||
        text.includes('cannon') ||
        text.includes('trexx') ||
        text.includes('roadster') ||
        text.includes('zoro') ||
        text.includes('milan') ||
        text.includes('tourer') ||
        text.includes('evo-') ||
        text.includes('stx-') ||
        text.includes('srg-') ||
        text.includes('v-pro') ||
        text.includes('bolt') ||
        text.includes('murano') ||
        text.includes('airpro') ||
        text.includes('equattro') ||
        text.includes('danko') ||
        text.includes('angus') ||
        text.includes('fear-lady') ||
        text.includes('julie-lady') ||
        text.includes('timmy') ||
        text.includes('hurricane') ||
        text.includes('pier') ||
        text.includes('r2') ||
        text.includes('ht-1') ||
        text.includes('nix') ||
        text.includes('lord') ||
        text.includes('calgary') ||
        text.includes('gt-tech') ||
        text.includes('torque') ||
        text.includes('durable')
      ) {
        motorcycleIds.push(p.id);
      }
    });

    console.log(`Found ${motorcycleIds.length} Torque / motorcycle products to delete from Supabase.`);
    if (motorcycleIds.length > 0) {
      const { error: delErr } = await supabase.from('products').delete().in('id', motorcycleIds);
      if (delErr) {
        console.error('Error deleting motorcycle products:', delErr);
      } else {
        console.log('Successfully deleted all motorcycle products from Supabase!');
      }
    }
  }

  // 2. Upsert authentic surgical products to Supabase
  console.log('Upserting clean surgical products to Supabase...');
  for (const prod of cleanSurgicalProducts) {
    const row = {
      id: prod.id,
      name: prod.title,
      slug: prod.slug,
      sku: prod.sku,
      category_id: prod.category_id,
      price: prod.price,
      is_active: true,
      is_featured: prod.is_featured,
      is_new: prod.is_new_arrival,
      short_description: prod.short_description,
      description: prod.full_description,
      main_image_url: prod.featured_image,
      source_data: prod
    };
    const { error: upsertErr } = await supabase.from('products').upsert(row, { onConflict: 'id' });
    if (upsertErr) {
      console.error(`Failed to upsert ${prod.title}:`, upsertErr);
    } else {
      console.log(`✓ Upserted surgical product: ${prod.title}`);
    }
  }

  // 3. Write clean products to src/data/products.json
  fs.writeFileSync('src/data/products.json', JSON.stringify(cleanSurgicalProducts, null, 2), 'utf8');
  console.log('✓ Updated src/data/products.json with clean surgical instruments.');
}

run();
