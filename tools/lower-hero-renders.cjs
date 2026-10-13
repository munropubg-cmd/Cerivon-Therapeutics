/*
 * Hero card renders: push each product down (away from the card title) without zooming,
 * by extending the out-of-focus top of the render. Bottom rows of the same height drop off.
 * Originals live in tools/originals/. Run: node tools/lower-hero-renders.cjs
 */
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

const JOBS = [
  { name: 'weight-semaglutide', pad: 0.055 },
  { name: 'peptides-nad', pad: 0.14 },
  { name: 'sexual-tadalafil', pad: 0.085 },
];
const BLEND = 90; // px of the original's top that fade in from the soft extension

(async () => {
  for (const { name, pad: frac } of JOBS) {
    const src = await loadImage(fs.readFileSync(path.join(__dirname, 'originals', `${name}.original.webp`)));
    const W = src.width, H = src.height, pad = Math.round(H * frac);
    const c = createCanvas(W, H), x = c.getContext('2d');

    // 1. soft extension: the top rows stretched up, then blurred together with the seam
    x.drawImage(src, 0, pad);
    x.drawImage(src, 0, 0, W, 24, 0, 0, W, pad + 6);
    x.filter = 'blur(24px)';
    x.drawImage(c, 0, 0, W, pad + BLEND, 0, 0, W, pad + BLEND);
    x.filter = 'none';

    // 2. fade the sharp original back in across the seam
    const band = createCanvas(W, BLEND), b = band.getContext('2d');
    b.drawImage(src, 0, 0, W, BLEND, 0, 0, W, BLEND);
    const g = b.createLinearGradient(0, 0, 0, BLEND);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,1)');
    b.globalCompositeOperation = 'destination-in'; b.fillStyle = g; b.fillRect(0, 0, W, BLEND);
    x.drawImage(band, 0, pad);

    fs.writeFileSync(path.join(__dirname, '..', 'public/assets/img/hero', `${name}.webp`), await c.encode('webp', 90));
    console.log(name, 'pad', pad);
  }
})();
