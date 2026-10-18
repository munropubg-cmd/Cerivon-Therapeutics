/*
 * Removes white halos left from a cut-out's original background.
 * Erodes the alpha edge by RADIUS px, pulls edge pixel colours from the solid interior
 * (so nothing light bleeds), then feathers 1px. Run: node tools/defringe.cjs in.webp out.webp [radius]
 */
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const fs = require('fs');
const [inp, out, r = '2'] = process.argv.slice(2);
const RADIUS = Number(r);
(async () => {
  const im = await loadImage(fs.readFileSync(inp));
  const W = im.width, H = im.height, c = createCanvas(W, H), x = c.getContext('2d');
  x.drawImage(im, 0, 0);
  const d = x.getImageData(0, 0, W, H), p = d.data;
  const A = new Uint8Array(W * H); for (let i = 0; i < W * H; i++) A[i] = p[i * 4 + 3];
  // 1. erode: alpha = min over a (2R+1) square
  let a = A;
  for (let k = 0; k < RADIUS; k++) {
    const n = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) for (let X = 0; X < W; X++) {
      let m = a[y * W + X];
      if (m) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const yy = y + dy, xx = X + dx; const v = (yy < 0 || yy >= H || xx < 0 || xx >= W) ? 0 : a[yy * W + xx]; if (v < m) m = v;
      }
      n[y * W + X] = m;
    }
    a = n;
  }
  // 1b. near-white pixels in a 16px band along the edge are leftover background (between hair strands)
  {
    const BAND = 16; let dist = new Uint8Array(W * H).fill(255);
    for (let i = 0; i < W * H; i++) if (!a[i]) dist[i] = 0;
    for (let k = 1; k <= BAND; k++) for (let y = 1; y < H - 1; y++) for (let X = 1; X < W - 1; X++) {
      const i = y * W + X; if (dist[i] !== 255) continue;
      if (dist[i - 1] === k - 1 || dist[i + 1] === k - 1 || dist[i - W] === k - 1 || dist[i + W] === k - 1) dist[i] = k;
    }
    for (let i = 0; i < W * H; i++) {
      if (dist[i] === 0 || dist[i] > BAND) continue;
      const R = p[i * 4], G = p[i * 4 + 1], B = p[i * 4 + 2], mx = Math.max(R, G, B), mn = Math.min(R, G, B);
      if (mn > 226 && mx - mn < 22) a[i] = 0;
    }
  }
  // 2. edge colour from the solid interior within 4px
  for (let y = 0; y < H; y++) for (let X = 0; X < W; X++) {
    const i = y * W + X; if (!a[i] || a[i] === 255 && A[i] === 255) continue;
    let rs = 0, gs = 0, bs = 0, n = 0;
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
      const yy = y + dy, xx = X + dx; if (yy < 0 || yy >= H || xx < 0 || xx >= W) continue;
      const j = yy * W + xx; if (a[j] === 255) { rs += p[j * 4]; gs += p[j * 4 + 1]; bs += p[j * 4 + 2]; n++; }
    }
    if (n) { p[i * 4] = rs / n; p[i * 4 + 1] = gs / n; p[i * 4 + 2] = bs / n; }
  }
  // 3. 1px feather (box blur of alpha)
  for (let y = 0; y < H; y++) for (let X = 0; X < W; X++) {
    let s = 0, n = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const yy = y + dy, xx = X + dx; if (yy < 0 || yy >= H || xx < 0 || xx >= W) continue; s += a[yy * W + xx]; n++; }
    p[(y * W + X) * 4 + 3] = Math.min(a[y * W + X] ? 255 : 0, s / n) || 0;
  }
  x.putImageData(d, 0, 0);
  fs.writeFileSync(out, await c.encode('webp', 90));
  console.log('done', W, H);
})();
