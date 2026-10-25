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

async function check() {
  const { data, error } = await supabase.from('products').select('id, name, slug, main_image_url, category_id, source_data');
  if (error) {
    console.error('Supabase error:', error);
  } else {
    console.log('Total products in Supabase:', data?.length);
    data?.forEach(p => {
      console.log('Product:', { id: p.id, name: p.name, slug: p.slug, img: p.main_image_url });
    });
  }
}

check();
