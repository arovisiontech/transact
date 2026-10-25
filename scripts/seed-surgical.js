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
  const { data: categories } = await supabase.from('categories').select('*');
  console.log('Categories in Supabase:', categories ? categories.length : 0);
  if (categories && categories.length > 0) {
    console.log(categories.map(c => ({ id: c.id, name: c.name, slug: c.slug })));
  }

  // Check remaining products
  const { data: remaining } = await supabase.from('products').select('id, name, slug');
  console.log('Remaining products in Supabase:', remaining);

  // Insert our 8 clean surgical products with real UUIDs
  const cleanSurgical = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));
  for (const prod of cleanSurgical) {
    // Generate deterministic UUID from slug
    const hash = crypto.createHash('md5').update(prod.slug).digest('hex');
    const uuid = `${hash.slice(0,8)}-${hash.slice(8,12)}-4${hash.slice(13,16)}-a${hash.slice(17,20)}-${hash.slice(20,32)}`;
    
    // Find matching category UUID if any
    const cat = categories ? categories.find(c => c.name.toLowerCase().includes(prod.category_name.toLowerCase()) || c.slug === prod.category_id) : null;
    
    const row = {
      id: uuid,
      name: prod.title,
      slug: prod.slug,
      sku: prod.sku,
      category_id: cat ? cat.id : null,
      price: prod.price,
      is_active: true,
      is_featured: prod.is_featured,
      is_new: prod.is_new_arrival,
      short_description: prod.short_description,
      description: prod.full_description,
      main_image_url: prod.featured_image,
      source_data: { ...prod, id: uuid }
    };
    
    const { error } = await supabase.from('products').upsert(row, { onConflict: 'id' });
    if (error) {
      console.error(`Failed to upsert ${prod.title}:`, error);
    } else {
      console.log(`✓ Upserted surgical product to Supabase: ${prod.title} (UUID: ${uuid})`);
      prod.id = uuid;
    }
  }

  // Update src/data/products.json with matching UUIDs
  fs.writeFileSync('src/data/products.json', JSON.stringify(cleanSurgical, null, 2), 'utf8');
}

run();
