/**
 * Builds ready-to-upload logo files for social profiles and covers.
 * Sources are the existing brand art in public/. Run: node scratch/make-social-logos.mjs
 */
import sharp from "sharp";
import fs from "node:fs";

const OUT = "brand/social";
const MAROON = { r: 0x7a, g: 0x2a, b: 0x3d, alpha: 1 };
const BLUSH  = { r: 0xfb, g: 0xd9, b: 0xde, alpha: 1 };
const CREAM  = { r: 0xfc, g: 0xf9, b: 0xf3, alpha: 1 };
const GOLD   = { r: 0xb0, g: 0x8d, b: 0x4f, alpha: 1 };

fs.mkdirSync(OUT, { recursive: true });

/** Trim the transparent margin so the mark can be scaled to fill properly. */
async function trimmed(src) {
  const { data, info } = await sharp(src)
    .trim({ threshold: 8 })
    .png()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

/** Repaint artwork in a flat colour, keeping its alpha (for dark backgrounds). */
async function recolour(buf, colour) {
  const alpha = await sharp(buf).ensureAlpha().extractChannel("alpha").toBuffer();
  const { width, height } = await sharp(buf).metadata();
  return sharp({
    create: { width, height, channels: 3, background: colour },
  })
    .joinChannel(alpha)
    .png()
    .toBuffer();
}

/** Square profile picture. Art is kept inside the circle platforms crop to. */
async function square(art, bg, file, size = 1024, fill = 0.68) {
  const meta = await sharp(art).metadata();
  const scale = Math.min((size * fill) / meta.width, (size * fill) / meta.height);
  const w = Math.round(meta.width * scale);
  const h = Math.round(meta.height * scale);
  const layer = await sharp(art).resize(w, h).png().toBuffer();

  await sharp({ create: { width: size, height: size, channels: 4, background: bg } })
    .composite([{ input: layer, top: Math.round((size - h) / 2), left: Math.round((size - w) / 2) }])
    .png()
    .toFile(`${OUT}/${file}`);
  console.log(`${file}  ${size}x${size}`);
}

const full = await trimmed("public/logo-transparent.png");
const wide = await trimmed("public/kayfiy-horizontal-clean.png");

const fullCream = await recolour(full.data, CREAM);
const wideCream = await recolour(wide.data, CREAM);

// Profile pictures — Instagram, Facebook, WhatsApp, TikTok
await square(full.data, BLUSH, "profile-blush.png");
await square(full.data, CREAM, "profile-cream.png");
await square(fullCream, MAROON, "profile-maroon.png");

// Cover / header banner, 1500x500 (X, Facebook, LinkedIn)
{
  const W = 1500, H = 500;
  const meta = await sharp(wideCream).metadata();
  const scale = Math.min((W * 0.52) / meta.width, (H * 0.5) / meta.height);
  const w = Math.round(meta.width * scale);
  const h = Math.round(meta.height * scale);
  const mark = await sharp(wideCream).resize(w, h).png().toBuffer();
  const lineW = Math.round(w * 0.55);
  const hairline = await sharp({
    create: { width: lineW, height: 2, channels: 4, background: GOLD },
  }).png().toBuffer();

  await sharp({ create: { width: W, height: H, channels: 4, background: MAROON } })
    .composite([
      { input: mark, top: Math.round(H / 2 - h / 2 - 18), left: Math.round((W - w) / 2) },
      { input: hairline, top: Math.round(H / 2 + h / 2 + 26), left: Math.round((W - lineW) / 2) },
    ])
    .png()
    .toFile(`${OUT}/cover-1500x500.png`);
  console.log("cover-1500x500.png  1500x500");
}

// Transparent lockups for putting over photos or other artwork
await sharp(full.data).resize({ width: 2000 }).png().toFile(`${OUT}/logo-maroon-transparent.png`);
await sharp(fullCream).resize({ width: 2000 }).png().toFile(`${OUT}/logo-cream-transparent.png`);
await sharp(wide.data).resize({ width: 2000 }).png().toFile(`${OUT}/logo-horizontal-maroon.png`);
await sharp(wideCream).resize({ width: 2000 }).png().toFile(`${OUT}/logo-horizontal-cream.png`);
console.log("transparent lockups written");

/* ---------------------------------------------------------------------------
 * Minimal marks. The full lockup carries four elements (figure, wordmark,
 * tagline, heart rule) which turn to mush at avatar size, so these strip it
 * back to the figure alone and to a figure + wordmark stack.
 * ------------------------------------------------------------------------ */

const lady = await trimmed("public/lady-clean.png");
const word = await trimmed("public/kayfiy-text-clean.png");
const ladyCream = await recolour(lady.data, CREAM);
const wordCream = await recolour(word.data, CREAM);

/** Figure above wordmark, optically balanced, nothing else. */
async function stacked(markBuf, wordBuf, colourName) {
  const mark = await sharp(markBuf).metadata();
  const wm = await sharp(wordBuf).metadata();

  const markW = 1200;
  const markH = Math.round((mark.height / mark.width) * markW);
  // Wordmark set a little wider than the figure so the pair reads as one block.
  const wordW = Math.round(markW * 1.18);
  const wordH = Math.round((wm.height / wm.width) * wordW);
  const gap = Math.round(markH * 0.18);

  const W = wordW;
  const H = markH + gap + wordH;

  const markLayer = await sharp(markBuf).resize(markW, markH).png().toBuffer();
  const wordLayer = await sharp(wordBuf).resize(wordW, wordH).png().toBuffer();

  return sharp({
    create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: markLayer, top: 0, left: Math.round((W - markW) / 2) },
      { input: wordLayer, top: markH + gap, left: 0 },
    ])
    .png()
    .toBuffer()
    .then(async (buf) => {
      await sharp(buf).toFile(`${OUT}/minimal-stacked-${colourName}.png`);
      console.log(`minimal-stacked-${colourName}.png  ${W}x${H}`);
      return buf;
    });
}

const stackedMaroon = await stacked(lady.data, word.data, "maroon");
const stackedCream = await stacked(ladyCream, wordCream, "cream");

// Avatars: figure only. This is the version that still reads at 40px.
await square(lady.data, BLUSH, "minimal-mark-blush.png", 1024, 0.56);
await square(ladyCream, MAROON, "minimal-mark-maroon.png", 1024, 0.56);
await square(lady.data, CREAM, "minimal-mark-cream.png", 1024, 0.56);

// Avatars: figure + wordmark, no tagline.
await square(stackedMaroon, BLUSH, "minimal-stacked-blush-profile.png", 1024, 0.62);
await square(stackedCream, MAROON, "minimal-stacked-maroon-profile.png", 1024, 0.62);

// Transparent minimal lockups
await sharp(lady.data).resize({ width: 1600 }).png().toFile(`${OUT}/minimal-mark-transparent.png`);
await sharp(ladyCream).resize({ width: 1600 }).png().toFile(`${OUT}/minimal-mark-cream-transparent.png`);
console.log("minimal set written");
