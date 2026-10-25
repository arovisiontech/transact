const fs = require('fs');

const content = fs.readFileSync('public/Transact INTL About us.svg', 'utf8');

// Find all rects with their x, y, width, height, fill
const rectRegex = /<rect([^>]+)>/g;
let m;
const rects = [];
while ((m = rectRegex.exec(content)) !== null) {
  const attrs = m[1];
  const x = attrs.match(/\bx="([^"]+)"/)?.[1] || '0';
  const y = attrs.match(/\by="([^"]+)"/)?.[1] || '0';
  const w = attrs.match(/\bwidth="([^"]+)"/)?.[1] || '0';
  const h = attrs.match(/\bheight="([^"]+)"/)?.[1] || '0';
  const fill = attrs.match(/\bfill="([^"]+)"/)?.[1] || '';
  rects.push({ x: parseFloat(x), y: parseFloat(y), w: parseFloat(w), h: parseFloat(h), fill });
}

rects.sort((a, b) => a.y - b.y);

console.log('--- Large background rects (>300px width/height) ---');
rects.filter(r => r.w > 300 || r.h > 200).forEach(r => {
  console.log(`y: ${r.y.toFixed(1)}, h: ${r.h.toFixed(1)}, w: ${r.w.toFixed(1)}, fill: ${r.fill}`);
});
