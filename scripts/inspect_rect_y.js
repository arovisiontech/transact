const fs = require('fs');
const svg = fs.readFileSync('public/Transact INTL About us.svg', 'utf8');

// Find all <rect ... fill="url(#pattern...)"> and print their y coordinates
const rectRegex = /<rect[^>]*?y="([^"]+)"[^>]*?fill="url\(#([^"]+)\)"[^>]*?>/g;
let m;
while ((m = rectRegex.exec(svg)) !== null) {
  console.log(`y: ${m[1]} -> ${m[2]} : ${m[0].substring(0, 100)}`);
}
