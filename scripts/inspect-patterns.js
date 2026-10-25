const fs = require('fs');

const content = fs.readFileSync('public/Transact INTL HOMEPAGE.svg', 'utf8');

// Find all patterns and their embedded images
const patterns = {};
const patRegex = /<pattern\s+id="([^"]+)"[^>]*>[\s\S]*?<image\s+[^>]*xlink:href="([^"]+)"[^>]*>[\s\S]*?<\/pattern>/gi;
let m;
while ((m = patRegex.exec(content)) !== null) {
  patterns[m[1]] = m[2].slice(0, 30) + '... (len: ' + m[2].length + ')';
}
console.log('Found patterns:', Object.keys(patterns));

// Find all elements using fill="url(#pattern...)" or similar
const patternUses = [];
const useRegex = /<(?:rect|path|circle)\s+([^>]*?)fill="url\(#([^"]+)\)"([^>]*?)>/gi;
let uM;
while ((uM = useRegex.exec(content)) !== null) {
  const full = uM[1] + ' ' + uM[3];
  const pat = uM[2];
  const x = (full.match(/x="([^"]+)"/) || [])[1] || '0';
  const y = (full.match(/y="([^"]+)"/) || [])[1] || '0';
  const w = (full.match(/width="([^"]+)"/) || [])[1] || '0';
  const h = (full.match(/height="([^"]+)"/) || [])[1] || '0';
  patternUses.push({ pattern: pat, x, y, w, h });
}
patternUses.sort((a,b) => parseFloat(a.y) - parseFloat(b.y));
console.log('Pattern placements:');
patternUses.forEach(p => console.log(`Y=${p.y}, X=${p.x}, W=${p.w}, H=${p.h} -> ${p.pattern}`));
