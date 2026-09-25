const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function testHues() {
  const inDir = 'public/banners/inunder';
  const outDir = 'public/banners/inunder/test';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Test Banner 1 (Desktop) with various hue shifts:
  // Original is purple ~270 deg.
  // To reach red/maroon/rose ~340-350 deg, shift by +75 to +85 deg (or -275 deg).
  const shifts = [60, 75, 85, 95, -60, -75];
  for (const s of shifts) {
    await sharp(path.join(inDir, 'banner-1-desktop.png'))
      .modulate({ hue: s })
      .toFile(path.join(outDir, `banner-1-hue-${s}.png`));
    console.log(`Created banner-1-hue-${s}.png`);
  }
}

testHues().catch(console.error);
