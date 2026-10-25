const fs = require('fs');

console.log('Reading SVG...');
const content = fs.readFileSync('public/Transact INTL HOMEPAGE.svg', 'utf8');
console.log('Total length:', content.length);

// Let's find all <text> elements or text-like contents
const texts = [];
const textRegex = /<text[^>]*>([\s\S]*?)<\/text>/gi;
let match;
while ((match = textRegex.exec(content)) !== null) {
  const clean = match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (clean) texts.push(clean);
}
console.log('Found texts count:', texts.length);
if (texts.length > 0) {
  console.log('Sample texts:', texts.slice(0, 50));
}

// In case Figma exported texts as paths (glyphs), let's search for aria-label or id or clip paths or image hrefs
const idMatches = [];
const idRegex = /id="([^"]+)"/g;
let idM;
while ((idM = idRegex.exec(content)) !== null) {
  if (!idM[1].startsWith('clip') && !idM[1].startsWith('filter') && !idM[1].startsWith('image') && !idM[1].startsWith('paint')) {
    idMatches.push(idM[1]);
  }
}
console.log('Non-generic IDs:', idMatches.slice(0, 50));

// Check images inside SVG (embedded base64 or xlink:href)
const imgMatches = [];
const imgRegex = /xlink:href="([^"]+)"/g;
let imgM;
while ((imgM = imgRegex.exec(content)) !== null) {
  const href = imgM[1];
  if (href.startsWith('data:image')) {
    imgMatches.push(href.slice(0, 30) + '... (' + href.length + ' bytes)');
  } else {
    imgMatches.push(href);
  }
}
console.log('Image hrefs count:', imgMatches.length);
console.log('Sample images:', imgMatches.slice(0, 30));

// Let's find background rects with height > 100
const rects = [];
const rectRegex = /<rect\s+([^>]*?)>/gi;
let rM;
while ((rM = rectRegex.exec(content)) !== null) {
  const tag = rM[1];
  const yM = tag.match(/y="([^"]+)"/);
  const wM = tag.match(/width="([^"]+)"/);
  const hM = tag.match(/height="([^"]+)"/);
  const fillM = tag.match(/fill="([^"]+)"/);
  if (yM && hM && parseFloat(hM[1]) > 50) {
    rects.push({ y: parseFloat(yM[1]), w: parseFloat(wM ? wM[1] : 0), h: parseFloat(hM[1]), fill: fillM ? fillM[1] : '' });
  }
}
rects.sort((a,b) => a.y - b.y);
console.log('Major rects:');
rects.slice(0, 30).forEach(r => console.log(`Y=${r.y}, W=${r.w}, H=${r.h}, Fill=${r.fill}`));
