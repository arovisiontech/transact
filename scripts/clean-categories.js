const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
});

const key = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, key);

async function run() {
  // 1. Delete remaining motorcycle products: STORM and Waterproof Touring Jacket
  const { error: delProdErr } = await supabase.from('products').delete().in('slug', ['storm', 'waterproof-touring-6']);
  if (!delProdErr) console.log('✓ Deleted storm and waterproof touring jacket from Supabase products.');

  // 2. Fetch categories from Supabase
  const { data: oldCats } = await supabase.from('categories').select('*');
  console.log('Old categories:', oldCats);

  // 3. Clear motorcycle categories: 'textile-trousers', 'jackets', 'textile', 'gloves', 'accessories'
  const motorcycleCatSlugs = ['textile-trousers', 'jackets', 'textile', 'gloves', 'accessories'];
  const { error: delCatErr } = await supabase.from('categories').delete().in('slug', motorcycleCatSlugs);
  if (!delCatErr) console.log('✓ Deleted motorcycle categories from Supabase categories.');

  // 4. Authentic Transact surgical categories matching Transact INTL HOMEPAGE.svg
  const surgicalCategories = [
    {
      name: 'General Surgery',
      slug: 'general-surgery',
      description: 'Precision forged hemostatic forceps, dissecting scissors, needle holders, and surgical retractors.',
      card_image: '/Rectangle 819.svg',
      product_count: 24
    },
    {
      name: 'Cardiovascular & Thoracic',
      slug: 'cardiovascular-thoracic',
      description: 'Atraumatic vascular clamps, micro needle holders, rib spreaders, and vessel cannulas.',
      card_image: '/Rectangle 823.svg',
      product_count: 18
    },
    {
      name: 'Orthopedic & Bone Surgery',
      slug: 'orthopedic-bone',
      description: 'Heavy bone rongeurs, bone cutting forceps, osteotomes, bone holding clamps, and mallets.',
      card_image: '/Rectangle 824.svg',
      product_count: 16
    },
    {
      name: 'Dental & Oral Maxillofacial',
      slug: 'dental-oral',
      description: 'Tooth extracting forceps, root elevators, periodontal curettes, and orthodontic pliers.',
      card_image: '/Rectangle 826.svg',
      product_count: 22
    },
    {
      name: 'Diagnostic & Anesthesia',
      slug: 'diagnostic-anesthesia',
      description: 'Fiber optic laryngoscopes, clinical otoscopes, ophthalmoscopes, and percussion hammers.',
      card_image: '/Rectangle 839.svg',
      product_count: 14
    }
  ];

  console.log('Inserting authentic surgical categories...');
  for (const cat of surgicalCategories) {
    const hash = crypto.createHash('md5').update(cat.slug).digest('hex');
    const uuid = `${hash.slice(0,8)}-${hash.slice(8,12)}-4${hash.slice(13,16)}-a${hash.slice(17,20)}-${hash.slice(20,32)}`;
    const row = {
      id: uuid,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image_url: cat.card_image,
      is_active: true
    };
    const { error: catErr } = await supabase.from('categories').upsert(row, { onConflict: 'id' });
    if (catErr) console.error(`Error upserting category ${cat.name}:`, catErr);
    else console.log(`✓ Upserted surgical category: ${cat.name}`);
  }

  // 5. Verify remaining products in Supabase
  const { data: finalProds } = await supabase.from('products').select('id, name, slug, main_image_url');
  console.log('Final clean surgical products in Supabase:', finalProds);
}

run();
