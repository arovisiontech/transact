const fs = require('fs');
const svg = fs.readFileSync('public/Transact INTL About us.svg', 'utf8');

// The section is around y=4200 to y=5300
// Let's find rects for the 5 cards:
// Card 1: x around 332 or similar
const cardRegex = /<rect[^>]*?width="17[0-9]"[^>]*?height="2[0-9]{2}"[^>]*?>/g;
let m;
while ((m = cardRegex.exec(svg)) !== null) {
  console.log(m[0]);
}
