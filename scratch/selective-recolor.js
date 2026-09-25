const sharp = require('sharp');
const fs = require('fs');

async function selectiveRecolor() {
  const { data, info } = await sharp('public/banners/inunder/banner-1-desktop.png')
    .raw()
    .toBuffer({ resolveWithObject: true });

  // info has width, height, channels (4)
  const { width, height, channels } = info;
  const out = Buffer.from(data);

  for (let i = 0; i < out.length; i += channels) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];

    // Check if pixel is purple/lavender:
    // Purple has high blue and red, lower green, with blue >= red or blue significantly > green.
    // e.g. background lavender: r: 210, g: 180, b: 235
    // dark purple text: r: 120, g: 70, b: 160
    // skin tone: r: 210, g: 150, b: 130 (red is highest, green second, blue lowest)
    if (b > g + 15 && (b >= r - 30)) {
      // It's lavender/purple!
      // Convert to warm blush / maroon:
      // In maroon/wine: red is high, blue and green are lower.
      // e.g. text: dark maroon (122, 42, 61)
      // e.g. background: soft blush (248, 235, 238)
      const brightness = (r + g + b) / 3;
      if (brightness < 160) {
        // Dark purple text -> Rich Maroon (#7A2A3D = 122, 42, 61)
        const factor = brightness / 160;
        out[i] = Math.round(122 * factor + 30);
        out[i + 1] = Math.round(42 * factor);
        out[i + 2] = Math.round(61 * factor + 10);
      } else {
        // Lavender background -> Soft Warm Blush / Rose / Cream
        // e.g. (245, 230, 235)
        const factor = (brightness - 160) / (255 - 160);
        out[i] = Math.min(255, Math.round(230 + 25 * factor));
        out[i + 1] = Math.min(255, Math.round(210 + 35 * factor));
        out[i + 2] = Math.min(255, Math.round(220 + 25 * factor));
      }
    }
  }

  await sharp(out, { raw: { width, height, channels } })
    .png()
    .toFile('public/banners/inunder/test/banner-1-kayfiy-recolor.png');
  console.log('Done banner-1-kayfiy-recolor.png');
}

selectiveRecolor().catch(console.error);
