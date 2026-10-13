// Bakes product labels (Inter Regular) onto the client's blank container renders.
// Unbranded per the brief: product name, form and "Rx only" only. No logo, company name or website.
const { loadImage, createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');
// Usage (one-time setup: npm i -D @napi-rs/canvas@0.1.65 @fontsource/inter@5.1.0):
//   node tools/label-products.cjs
// Add or edit a product in PRODUCTS below, re-run, and the labeled webp lands in public/assets/img/products/.
const srcDir = path.join(__dirname, 'blank-renders');
const outDir = path.join(__dirname, '../public/assets/img/products');
// Full-resolution transparent PNGs for reuse (decks, ads, social, Lovable)
const pngDir = path.join(__dirname, '../Product Renders');

const fontDir = path.join(__dirname, '../node_modules/@fontsource/inter/files');
const ok = GlobalFonts.registerFromPath(path.join(fontDir, 'inter-latin-400-normal.woff2'), 'InterLabel')
  || GlobalFonts.registerFromPath(path.join(fontDir, 'inter-latin-400-normal.woff'), 'InterLabel');
if (!ok) throw new Error('Inter font failed to register');

// Label areas measured on the 1254px renders (left, top, right, bottom)
const CONTAINERS = {
  bottle: { file: 'bottle.webp', label: [327, 508, 925, 968] },  // capsule / tablet bottle
  pump:   { file: 'pump.webp', label: [392, 520, 856, 1000] }, // foam pump (label = white body)
  jar:    { file: 'jar.webp', label: [124, 572, 1130, 960] }, // cream jar
  dropper:{ file: 'dropper.webp', label: [399, 608, 851, 1016] }, // dropper bottle
  nasal:  { file: 'nasal.webp', label: [442, 716, 818, 1064] }, // nasal spray
  vial:   { file: 'vial.webp', label: [331, 516, 925, 992] },  // injectable vial
};

const P = (slug, container, kicker, name, form, rx = true) => ({ slug, container, kicker, name, form, rx });
const PRODUCTS = [
  P('semaglutide', 'vial', 'Compounded', 'Semaglutide', 'Injectable vial'),
  P('tirzepatide', 'vial', 'Compounded', 'Tirzepatide', 'Injectable vial'),
  P('sermorelin', 'vial', 'Compounded', 'Sermorelin', 'Injectable vial'),
  P('nad', 'vial', 'Compounded', 'NAD+', 'Injectable vial'),
  P('glutathione', 'vial', 'Compounded', 'Glutathione', 'Injectable vial'),
  P('pt-141', 'vial', 'Compounded', 'PT-141', 'Injectable vial'),
  P('nad-nasal-spray', 'nasal', 'Compounded', 'NAD+', 'Nasal spray'),
  P('biest', 'bottle', 'Compounded', 'BIEST', 'Oral capsules'),
  P('estradiol', 'bottle', 'Compounded', 'Estradiol', 'Oral capsules'),
  P('liothyronine', 'bottle', 'Compounded', 'Liothyronine', 'Oral capsules'),
  P('progesterone-ir', 'bottle', 'Compounded', 'Progesterone IR', 'Oral capsules'),
  P('t3-t4', 'bottle', 'Compounded', 'T3/T4', 'Oral capsules'),
  P('sildenafil', 'bottle', 'Prescription', 'Sildenafil', 'Oral capsules'),
  P('tadalafil', 'bottle', 'Prescription', 'Tadalafil', 'Oral capsules'),
  P('tretinoin-cream', 'jar', 'Compounded', 'Tretinoin', 'Topical cream'),
  P('cashmere-cream', 'jar', 'Compounded', 'Cashmere', 'Topical cream'),
  P('ghk-cu-cream', 'jar', 'Compounded', 'GHK-Cu', 'Topical cream'),
  P('dhea', 'jar', 'Compounded', 'DHEA', 'Topical cream'),
  P('tretinoin-foam', 'pump', 'Compounded', 'Tretinoin', 'Topical foam'),
  P('tretinoin-gel', 'pump', 'Compounded', 'Tretinoin', 'Topical gel'),
  P('finasteride', 'dropper', 'Compounded', 'Finasteride', 'Topical solution'),
  P('minoxidil', 'dropper', 'Topical', 'Minoxidil', 'Topical solution', false),
];

const NAVY = '#0B1930', TEAL = '#1F7F8E', GREY = '#5E6B78';

/*
 * Cap tints: recolour the teal cap (and its teal reflections in the glass) per category,
 * keeping every pixel's own lightness so shading, highlights and the matte finish survive.
 * Labels and glass are untouched (they are low-saturation). The label accent follows the cap.
 */
const TINTS = {
  rose: { hue: 343, sat: 0.5, light: 1.6, lightAdd: 0.03, accent: '#A8506E' }, // Skincare: matches the blush section + pink button
};
const TINT_BY_SLUG = {
  'tretinoin-cream': 'rose', 'tretinoin-gel': 'rose', 'tretinoin-foam': 'rose', 'cashmere-cream': 'rose', 'ghk-cu-cream': 'rose',
};

function rgb2hsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min, s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}
function hsl2rgb(h, s, l) {
  const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}
function tintCap(ctx, W, H, t) {
  const id = ctx.getImageData(0, 0, W, H), d = id.data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] === 0) continue;
    const [h, s, l] = rgb2hsl(d[i], d[i + 1], d[i + 2]);
    if (h < 165 || h > 215 || s < 0.18) continue; // only the teal family
    // fade the shift in for weakly-teal pixels so edges and reflections blend
    const w = Math.min(1, (s - 0.18) / 0.2);
    const [nr, ng, nb] = hsl2rgb(t.hue, Math.min(1, s * t.sat), Math.min(0.97, l * t.light + t.lightAdd));
    d[i] = d[i] + (nr - d[i]) * w; d[i + 1] = d[i + 1] + (ng - d[i + 1]) * w; d[i + 2] = d[i + 2] + (nb - d[i + 2]) * w;
  }
  ctx.putImageData(id, 0, 0);
}
const font = (px) => `${px}px InterLabel`;

function fitSize(ctx, text, maxW, start, tracking = 0) {
  let s = start;
  for (; s > 8; s -= 1) { ctx.font = font(s); if (ctx.measureText(text).width + tracking * s * text.length <= maxW) break; }
  return s;
}
function drawTracked(ctx, text, cx, y, trackEm) {
  // letter-spaced text, centred on cx
  const size = parseFloat(ctx.font);
  const sp = trackEm * size;
  const widths = [...text].map((ch) => ctx.measureText(ch).width);
  const total = widths.reduce((a, b) => a + b, 0) + sp * (text.length - 1);
  let x = cx - total / 2;
  [...text].forEach((ch, i) => { ctx.fillText(ch, x, y); x += widths[i] + sp; });
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(pngDir, { recursive: true });
  const cache = {};
  for (const p of PRODUCTS) {
    const C = CONTAINERS[p.container];
    const img = cache[C.file] || (cache[C.file] = await loadImage(path.join(srcDir, C.file)));
    const W = img.width, H = img.height;
    const cv = createCanvas(W, H), ctx = cv.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const tint = TINTS[TINT_BY_SLUG[p.slug]];
    if (tint) tintCap(ctx, W, H, tint);
    const ACCENT = tint ? tint.accent : TEAL;

    const [L, T, R, B] = C.label;
    const lw = R - L, lh = B - T, cx = (L + R) / 2;
    const inner = lw * 0.78;
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';

    // sizes relative to the label height (and capped by width)
    const kick = Math.max(12, Math.round(Math.min(lh * 0.055, lw * 0.06)));
    const nameStart = Math.round(Math.min(lh * 0.17, lw * 0.2));
    ctx.font = font(nameStart);
    const nameSize = fitSize(ctx, p.name, inner, nameStart);
    const form = Math.max(12, Math.round(Math.min(lh * 0.058, lw * 0.065)));
    const rxs = Math.max(10, Math.round(form * 0.82));

    // vertical rhythm, centred in the label
    const gap1 = nameSize * 0.42, gap2 = nameSize * 0.5, gap3 = form * 1.0, gap4 = form * 1.3;
    const block = kick + gap1 + nameSize + gap2 + 2 + gap3 + form + (p.rx ? gap4 + rxs : 0);
    let y = T + (lh - block) / 2;

    ctx.fillStyle = ACCENT;
    ctx.font = font(kick);
    y += kick;
    drawTracked(ctx, p.kicker.toUpperCase(), cx, y, 0.22);

    ctx.fillStyle = NAVY;
    ctx.font = font(nameSize);
    y += gap1 + nameSize * 0.92;
    drawTracked(ctx, p.name, cx, y, -0.02);

    y += gap2;
    ctx.fillStyle = ACCENT;
    const rule = Math.min(lw * 0.16, 90);
    ctx.fillRect(cx - rule / 2, y, rule, Math.max(2, Math.round(lh * 0.005)));

    ctx.fillStyle = GREY;
    ctx.font = font(form);
    y += gap3 + form;
    drawTracked(ctx, p.form, cx, y, 0.01);

    if (p.rx) {
      ctx.fillStyle = 'rgba(94, 107, 120, .75)';
      ctx.font = font(rxs);
      y += gap4;
      drawTracked(ctx, 'Rx only', cx, y, 0.08);
    }

    // crop to the object (alpha bounds) + small margin, then scale to max 820px tall
    const d = ctx.getImageData(0, 0, W, H).data;
    let x0 = W, x1 = 0, y0 = H, y1 = 0;
    for (let yy = 0; yy < H; yy += 2) for (let xx = 0; xx < W; xx += 2) if (d[(yy * W + xx) * 4 + 3] > 12) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (yy < y0) y0 = yy; if (yy > y1) y1 = yy; }
    const m = 14;
    x0 = Math.max(0, x0 - m); y0 = Math.max(0, y0 - m); x1 = Math.min(W, x1 + m); y1 = Math.min(H, y1 + m);
    const cw = x1 - x0, ch = y1 - y0;
    const scale = Math.min(1, 820 / ch);
    const out = createCanvas(Math.round(cw * scale), Math.round(ch * scale));
    const o = out.getContext('2d');
    o.imageSmoothingQuality = 'high';
    o.drawImage(cv, x0, y0, cw, ch, 0, 0, out.width, out.height);
    const buf = await out.encode('webp', 90);

    // full-resolution PNG (no downscale), same crop, transparent background
    const full = createCanvas(cw, ch);
    full.getContext('2d').drawImage(cv, x0, y0, cw, ch, 0, 0, cw, ch);
    // e.g. "Semaglutide - Injectable vial.png", "Tretinoin - Topical foam.png" ("/" in T3/T4 becomes "-")
    const fileName = `${p.name} - ${p.form}.png`.split('/').join('-');
    fs.writeFileSync(path.join(pngDir, fileName), await full.encode('png'));
    fs.writeFileSync(path.join(outDir, `${p.slug}.webp`), buf);
    console.log(p.slug, out.width + 'x' + out.height, Math.round(buf.length / 1024) + 'KB');
  }
})();
