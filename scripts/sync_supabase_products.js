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

async function sync() {
  const localProducts = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));
  console.log('Local products count:', localProducts.length);

  // Delete all existing in Supabase
  const { error: delErr } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delErr) console.warn('Delete warning:', delErr);
  else console.log('Cleared Supabase products table');

  // Insert current local products
  for (const p of localProducts) {
    const { error: insErr } = await supabase.from('products').upsert({
      id: p.id,
      name: p.title,
      slug: p.slug,
      sku: p.sku,
      price: p.price,
      short_description: p.short_description,
      description: p.full_description,
      main_image_url: p.featured_image,
      category_id: p.category_id,
      is_active: p.is_published,
      is_published: p.is_published,
      is_featured: p.is_featured,
      sort_order: p.sort_order,
      source_data: p,
      updated_at: new Date().toISOString()
    });
    if (insErr) console.error('Insert error:', insErr);
    else console.log('Synced to Supabase:', p.title);
  }
}

sync();
