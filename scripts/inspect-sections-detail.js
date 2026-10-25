const fs = require('fs');

const content = fs.readFileSync('public/Transact INTL HOMEPAGE.svg', 'utf8');

// List of ranges
const ranges = [
  { name: 'TopBar & Nav', y1: 0, y2: 150 },
  { name: 'Hero', y1: 150, y2: 1099 },
  { name: 'Below Hero Strip', y1: 1099, y2: 1333 },
  { name: 'Section 3', y1: 1333, y2: 2129 },
  { name: 'Section 4', y1: 2129, y2: 2910 },
  { name: 'Section 5', y1: 2910, y2: 4310 },
  { name: 'Section 6', y1: 4310, y2: 5501 },
  { name: 'Section 7', y1: 5501, y2: 6075 },
  { name: 'Section 8', y1: 6075, y2: 7202 },
  { name: 'Section 9', y1: 7202, y2: 8320 },
  { name: 'Section 10 (Orange)', y1: 8320, y2: 8926 },
  { name: 'Section 11', y1: 8926, y2: 9590 },
  { name: 'Footer', y1: 9590, y2: 10450 }
];

// Let's find patterns mapped to images
const patternToImg = {};
const patRegex = /<pattern\s+id="([^"]+)"[^>]*>[\s\S]*?<use\s+xlink:href="#([^"]+)"/g;
let m;
while ((m = patRegex.exec(content)) !== null) {
  patternToImg[m[1]] = m[2];
}
console.log('patternToImg count:', Object.keys(patternToImg).length);

// Let's find all rects and paths that have y attribute or coordinates
ranges.forEach(r => {
  console.log(`\n=================== ${r.name} (Y: ${r.y1} - ${r.y2}) ===================`);
  
  // Find rects in this range
  const rRegex = new RegExp(`<rect[^>]*?y="(\\d+(?:\\.\\d+)?)"[^>]*?>`, 'g');
  let rm;
  const foundRects = [];
  while ((rm = rRegex.exec(content)) !== null) {
    const y = parseFloat(rm[1]);
    if (y >= r.y1 && y < r.y2) {
      foundRects.push(rm[0].slice(0, 140));
    }
  }
  console.log(`Rects (${foundRects.length}):`);
  foundRects.slice(0, 8).forEach(fr => console.log('  ' + fr));

  // Find patterns used
  const pRegex = new RegExp(`fill="url\\(#([^"]+)\\)"[^>]*?y="(\\d+(?:\\.\\d+)?)"`, 'g');
  let pm;
  while ((pm = pRegex.exec(content)) !== null) {
    const y = parseFloat(pm[2]);
    if (y >= r.y1 && y < r.y2) {
      console.log(`  Pattern: ${pm[1]} (image: ${patternToImg[pm[1]] || '?'}) at Y=${y}`);
    }
  }
});
