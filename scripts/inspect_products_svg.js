const fs = require('fs');

const svg = fs.readFileSync('public/Transact INTL Products Page.svg', 'utf8');

// Find all patterns and images
const imgRegex = /<image\s+id="([^"]+)"\s+width="([^"]+)"\s+height="([^"]+)"/g;
let m;
const images = [];
while ((m = imgRegex.exec(svg)) !== null) {
  images.push({ id: m[1], w: m[2], h: m[3] });
}
console.log('Images in Products Page SVG:', images);

// Find all rects with fill url(#pattern...)
const rectRegex = /<rect[^>]*?y="([^"]+)"[^>]*?fill="url\(#([^"]+)\)"[^>]*?>/g;
let r;
while ((r = rectRegex.exec(svg)) !== null) {
  console.log('Rect at y:', r[1], 'pattern:', r[2], r[0].substring(0, 80));
}
