const fs = require('fs');
const svg = fs.readFileSync('public/Transact INTL About us.svg', 'utf8');

// Slicing SVG between y=4600 and y=5000
const snippet = svg.substring(svg.indexOf('y="4634"'), svg.indexOf('y="5366"'));
console.log('Snippet length:', snippet.length);

// Find all text or paths with fill colors in this snippet
const fills = new Set();
const fillRegex = /fill="([^"]+)"/g;
let m;
while ((m = fillRegex.exec(snippet)) !== null) {
  fills.add(m[1]);
}
console.log('Fills used:', Array.from(fills));
