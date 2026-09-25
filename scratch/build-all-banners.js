const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processBanner1(srcPath, destPath, isMobile) {
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.from(data);

  for (let i = 0; i < out.length; i += channels) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];

    const isSkin = (r > 140 && g > 90 && b < 170 && r > b + 25);
    if (isSkin) continue;

    // Detect lavender/purple (wall, text, curtain)
    if (b > g + 10 && b >= r - 35) {
      const brightness = (r + g + b) / 3;
      if (brightness < 150) {
        // Dark text -> Maroon (#7A2A3D = 122, 42, 61)
        const factor = brightness / 150;
        out[i] = Math.min(255, Math.round(122 * factor + 20));
        out[i + 1] = Math.min(255, Math.round(42 * factor));
        out[i + 2] = Math.min(255, Math.round(61 * factor + 10));
      } else {
        // Wall & curtain -> Soft warm blush/rose cream
        const factor = (brightness - 150) / 105;
        out[i] = Math.min(255, Math.round(242 + 13 * factor));
        out[i + 1] = Math.min(255, Math.round(228 + 22 * factor));
        out[i + 2] = Math.min(255, Math.round(230 + 15 * factor));
      }
    }
  }

  await sharp(out, { raw: { width, height, channels } })
    .png()
    .toFile(destPath);
  console.log('Saved', destPath);
}

async function processBanner2(srcPath, destPath) {
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.from(data);

  for (let i = 0; i < out.length; i += channels) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];

    const isSkin = (r > 130 && g > 80 && b < 160 && r > b + 25);
    if (isSkin) continue;

    // Detect lilac / purple
    if (b > g + 6 && b >= r - 15) {
      const brightness = (r + g + b) / 3;
      if (brightness < 160) {
        // Dark text & button -> Maroon
        const factor = brightness / 160;
        out[i] = Math.min(255, Math.round(122 * factor + 20));
        out[i + 1] = Math.min(255, Math.round(42 * factor + 5));
        out[i + 2] = Math.min(255, Math.round(61 * factor + 10));
      } else {
        // Soft Cream / Warm White Background
        const factor = (brightness - 160) / 95;
        out[i] = Math.min(255, Math.round(250 + 5 * factor));
        out[i + 1] = Math.min(255, Math.round(244 + 10 * factor));
        out[i + 2] = Math.min(255, Math.round(244 + 10 * factor));
      }
    }
  }

  await sharp(out, { raw: { width, height, channels } })
    .png()
    .toFile(destPath);
  console.log('Saved', destPath);
}

async function processBanner5(srcPath, destPath) {
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.from(data);

  for (let i = 0; i < out.length; i += channels) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];

    const isSkin = (r > 135 && g > 90 && b < 155 && r > b + 30);
    if (isSkin) continue;

    // Purple liquid gel
    if (b > g + 18) {
      const intensity = (r + b) / 2;
      out[i] = Math.min(255, Math.round(intensity * 1.1 + 25)); // Rich Ruby / Rose
      out[i + 1] = Math.round(g * 0.45);
      out[i + 2] = Math.round(b * 0.58);
    }
  }

  await sharp(out, { raw: { width, height, channels } })
    .png()
    .toFile(destPath);
  console.log('Saved', destPath);
}

async function run() {
  const targetDir = 'public/banners/hero';
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  console.log('Generating Banner 1 (Desktop + Mobile)...');
  await processBanner1('public/banners/inunder/banner-1-desktop.png', path.join(targetDir, 'banner-1-desktop.png'), false);
  await processBanner1('public/banners/inunder/banner-1-mobile.png', path.join(targetDir, 'banner-1-mobile.png'), true);

  console.log('Generating Banner 2 (Desktop + Mobile)...');
  await processBanner2('public/banners/inunder/banner-2-desktop.webp', path.join(targetDir, 'banner-2-desktop.png'));
  await processBanner2('public/banners/inunder/banner-2-mobile.png', path.join(targetDir, 'banner-2-mobile.png'));

  console.log('Copying Banner 3 (Desktop + Mobile - Already Pink/Garden Era)...');
  fs.copyFileSync('public/banners/inunder/banner-3-desktop.webp', path.join(targetDir, 'banner-3-desktop.webp'));
  fs.copyFileSync('public/banners/inunder/banner-3-mobile.webp', path.join(targetDir, 'banner-3-mobile.webp'));

  console.log('Copying Banner 4 (Desktop + Mobile - Already Pink/Summer Layer)...');
  fs.copyFileSync('public/banners/inunder/banner-4-desktop.webp', path.join(targetDir, 'banner-4-desktop.webp'));
  fs.copyFileSync('public/banners/inunder/banner-4-mobile.webp', path.join(targetDir, 'banner-4-mobile.webp'));

  console.log('Generating Banner 5 (Desktop + Mobile - Rich Ruby/Berry Gel)...');
  await processBanner5('public/banners/inunder/banner-5-desktop.webp', path.join(targetDir, 'banner-5-desktop.png'));
  await processBanner5('public/banners/inunder/banner-5-mobile.webp', path.join(targetDir, 'banner-5-mobile.png'));

  console.log('All 5 Hero Banners successfully prepared for Desktop & Mobile!');
}

run().catch(console.error);
