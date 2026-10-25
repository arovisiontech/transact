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

async function run() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }
  console.log('Total products in Supabase:', data.length);
  const sample = data.map(p => ({
    id: p.id,
    name: p.name || p.title,
    sku: p.sku,
    img: p.main_image_url || p.featured_image
  }));
  console.log('Sample products:', JSON.stringify(sample.slice(0, 15), null, 2));

  // Find any motorcycle or glove or torque products
  const torqueOrAlpha = data.filter(p => {
    const text = JSON.stringify(p).toLowerCase();
    return text.includes('glove') || text.includes('motorcycle') || text.includes('carbon tech') || text.includes('torque') || text.includes('durable');
  });
  console.log('Torque or Durable matches:', torqueOrAlpha.map(p => ({ id: p.id, name: p.name || p.title, img: p.main_image_url })));
}

run();
