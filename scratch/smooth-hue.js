const sharp = require('sharp');

// Let's do an HSL conversion in JS pixel-by-pixel for flawless, perfectly smooth photographic quality
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s, l];
}

function hslToRgb(h, s, l) {
  h /= 360;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

async function smoothRecolorBanner1(srcPath, destPath) {
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.from(data);

  for (let i = 0; i < out.length; i += channels) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];

    const [h, s, l] = rgbToHsl(r, g, b);

    // Purple / violet hue is typically between 240 and 310 deg
    if (h >= 240 && h <= 315 && s > 0.08) {
      // Shift hue smoothly towards Rose / Maroon / Blush (340 - 355 deg)
      // Map 240..315 -> 340..355
      const newH = 345 + ((h - 260) / 50) * 8;
      // Adjust saturation slightly for elegant luxury tone
      const newS = Math.min(1, s * 0.95);
      const [nr, ng, nb] = hslToRgb((newH + 360) % 360, newS, l);
      out[i] = nr;
      out[i + 1] = ng;
      out[i + 2] = nb;
    }
  }

  await sharp(out, { raw: { width, height, channels } })
    .png()
    .toFile(destPath);
  console.log('Smoothly recolored', destPath);
}

async function run() {
  await smoothRecolorBanner1('public/banners/inunder/banner-1-desktop.png', 'public/banners/hero/banner-1-desktop.png');
  await smoothRecolorBanner1('public/banners/inunder/banner-1-mobile.png', 'public/banners/hero/banner-1-mobile.png');
}

run().catch(console.error);
