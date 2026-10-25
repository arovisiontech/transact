const fs = require('fs');

const content = fs.readFileSync('public/Transact INTL HOMEPAGE.svg', 'utf8');

// Find all paths around Y=1099 to 1333
const pathRegex = /<path\s+[^>]*?d="M\d+\.?\d*\s+(\d+\.?\d*)[^"]*"[^>]*?>/g;
let pm;
let count = 0;
while ((pm = pathRegex.exec(content)) !== null) {
  const y = parseFloat(pm[1]);
  if (y >= 1099 && y <= 1333) {
    count++;
    if (count <= 10) {
      console.log('Path at Y=' + y + ': ' + pm[0].slice(0, 100));
    }
  }
}
console.log('Total paths in Y=1099..1333:', count);
