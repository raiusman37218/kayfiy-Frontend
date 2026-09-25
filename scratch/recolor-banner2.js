const sharp = require('sharp');

async function recolorBanner2() {
  const { data, info } = await sharp('public/banners/inunder/banner-2-desktop.webp')
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const out = Buffer.from(data);

  for (let i = 0; i < out.length; i += channels) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];

    // Check if pixel is purple/lilac:
    // Light lilac background: r ~ 230-245, g ~ 225-240, b ~ 245-255 (b > r and b > g)
    // Dark purple text/button: r ~ 90-130, g ~ 50-90, b ~ 150-180 (b significantly > r and g)
    if (b > g + 8 && b > r - 10) {
      const brightness = (r + g + b) / 3;
      if (brightness < 160) {
        // Dark purple text & button -> Rich Maroon (#7A2A3D = 122, 42, 61)
        const factor = brightness / 160;
        out[i] = Math.min(255, Math.round(122 * factor + 20));
        out[i + 1] = Math.min(255, Math.round(42 * factor + 5));
        out[i + 2] = Math.min(255, Math.round(61 * factor + 10));
      } else {
        // Lilac background -> Soft Cream / Blush
        const factor = (brightness - 160) / (255 - 160);
        out[i] = Math.min(255, Math.round(250 + 5 * factor));
        out[i + 1] = Math.min(255, Math.round(242 + 10 * factor));
        out[i + 2] = Math.min(255, Math.round(242 + 10 * factor));
      }
    }
  }

  await sharp(out, { raw: { width, height, channels } })
    .webp({ quality: 95 })
    .toFile('public/banners/inunder/test/banner-2-kayfiy-desktop.webp');
  console.log('Done banner-2-kayfiy-desktop.webp');
}

recolorBanner2().catch(console.error);
