const sharp = require('sharp');

async function testBanner5() {
  const { data, info } = await sharp('public/banners/inunder/banner-5-desktop.webp')
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const out = Buffer.from(data);

  // In banner 5, the model is at bottom left (around x < 850, y > 150).
  // The gel is bright purple/violet.
  // Converting purple gel to rich wine / ruby / burgundy:
  for (let i = 0; i < out.length; i += channels) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];

    // Check if pixel is part of the purple gel / background:
    // Purple gel has b > g + 25 and b >= r - 40
    // But exclude skin tone: skin tone has r > 160, g > 110, b < 140, r > b + 40!
    const isSkin = (r > g && g > b && (r - b > 40));
    if (!isSkin && b > g + 20) {
      // It's purple gel!
      // In wine/ruby/maroon, red is dominant, blue is low, green is low.
      // Swap blue and red intensity with rich wine tone:
      const intensity = (r + b) / 2;
      out[i] = Math.min(255, Math.round(intensity * 1.1 + 20)); // Red up
      out[i + 1] = Math.round(g * 0.45);                       // Green down
      out[i + 2] = Math.round(b * 0.55);                       // Blue down to give wine/ruby
    }
  }

  await sharp(out, { raw: { width, height, channels } })
    .webp({ quality: 95 })
    .toFile('public/banners/inunder/test/banner-5-kayfiy-desktop.webp');
  console.log('Done banner-5-kayfiy-desktop.webp');
}

testBanner5().catch(console.error);
