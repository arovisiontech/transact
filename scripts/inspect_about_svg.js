const fs = require('fs');
const svg = fs.readFileSync('public/Transact INTL About us.svg', 'utf8');

const regex = /<image\s+id="([^"]+)"\s+width="([^"]+)"\s+height="([^"]+)"/g;
let m;
const images = [];
while ((m = regex.exec(svg)) !== null) {
  images.push({ id: m[1], width: m[2], height: m[3], index: m.index });
}
console.log('Found images:', images.length);
images.forEach(img => console.log(img));
