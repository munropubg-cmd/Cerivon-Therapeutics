/*
 * Favicons: the Cerivon "C" symbol alone, in Bright Cyan, on a transparent background
 * (client request). Writes favicon.svg, favicon.ico (16/32/48), PNGs and touch icons into public/.
 * Run: node tools/make-favicons.cjs
 */
const { createCanvas, Path2D } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

const CYAN = '#52DCE1';
const PATHS = [
  'M 92,278 V 140 l 108,-62 100,60 -53,31 -47,-27 -73,42',
  'm 92,237 v 41 l 108,62 100,-59',
  'm 128,238 72,-41 50,29',
];
const out = (f) => path.join(__dirname, '..', 'public', f);

fs.writeFileSync(out('favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="36 49 320 320"><g fill="none" stroke="${CYAN}" stroke-linecap="square" stroke-linejoin="miter" stroke-width="42">${PATHS.map((d) => `<path d="${d}"/>`).join('')}</g></svg>\n`);

function png(size, { bg, pad = 0 } = {}) {
  const c = createCanvas(size, size), x = c.getContext('2d');
  if (bg) { x.fillStyle = bg; x.fillRect(0, 0, size, size); }
  const s = (size * (1 - pad * 2)) / 320;
  x.translate(size * pad, size * pad); x.scale(s, s); x.translate(-36, -49);
  x.lineWidth = 42; x.lineCap = 'square'; x.lineJoin = 'miter'; x.strokeStyle = CYAN;
  for (const d of PATHS) x.stroke(new Path2D(d));
  return c.encode('png');
}

/** ICO container holding PNG images (supported by every current browser). */
function ico(images) {
  const head = Buffer.alloc(6 + images.length * 16);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(images.length, 4);
  let offset = head.length;
  images.forEach(({ size, data }, i) => {
    const e = 6 + i * 16;
    head.writeUInt8(size >= 256 ? 0 : size, e); head.writeUInt8(size >= 256 ? 0 : size, e + 1);
    head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(data.length, e + 8); head.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([head, ...images.map((im) => im.data)]);
}

(async () => {
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(sizes.map((s) => png(s)));
  fs.writeFileSync(out('favicon.ico'), ico(sizes.map((size, i) => ({ size, data: pngs[i] }))));
  fs.writeFileSync(out('favicon-32.png'), pngs[1]);
  fs.writeFileSync(out('favicon-48.png'), pngs[2]);
  // app icons: transparent too (Android); Apple needs an opaque square, so a white one
  fs.writeFileSync(out('icon-192.png'), await png(192, { pad: 0.1 }));
  fs.writeFileSync(out('icon-512.png'), await png(512, { pad: 0.1 }));
  fs.writeFileSync(out('apple-touch-icon.png'), await png(180, { bg: '#FFFFFF', pad: 0.16 }));
  console.log('favicons written');
})();
