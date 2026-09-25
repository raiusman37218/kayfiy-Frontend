const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateHero() {
  const desktopImages = [
    '/banners/hero/banner-1-desktop.png',
    '/banners/hero/banner-2-desktop.png',
    '/banners/hero/banner-3-desktop.webp',
    '/banners/hero/banner-4-desktop.webp',
    '/banners/hero/banner-5-desktop.webp'
  ];

  const mobileImages = [
    '/banners/hero/banner-1-mobile.png',
    '/banners/hero/banner-2-mobile.png',
    '/banners/hero/banner-3-mobile.webp',
    '/banners/hero/banner-4-mobile.webp',
    '/banners/hero/banner-5-mobile.webp'
  ];

  const slideLinks = [
    '/collections/sale',
    '/collections/bras',
    '/collections/all',
    '/collections/bras',
    '/collections/all'
  ];

  // Fetch current store settings
  const { data: current, error: fetchErr } = await supabase
    .from('store_settings')
    .select('*')
    .limit(1)
    .single();

  if (fetchErr) {
    console.error('Fetch error:', fetchErr);
    return;
  }

  const announcements = current.announcements || {};
  announcements.heroSlideLinks = slideLinks;

  const { data, error } = await supabase
    .from('store_settings')
    .update({
      hero_desktop_image: JSON.stringify(desktopImages),
      hero_mobile_image: JSON.stringify(mobileImages),
      announcements: announcements,
      updated_at: new Date().toISOString()
    })
    .eq('id', current.id)
    .select();

  if (error) {
    console.error('Update error:', error);
  } else {
    console.log('Successfully updated store_settings with all 5 desktop & mobile banners!');
    console.log(data);
  }
}

updateHero().catch(console.error);
