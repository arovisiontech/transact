const fs = require('fs');
const svg = fs.readFileSync('public/Transact INTL About us.svg', 'utf8');

const regex = /<rect[^>]*?x="([^"]+)"\s+y="([45][0-9]{3})"[^>]*?>/g;
let m;
while ((m = regex.exec(svg)) !== null) {
  console.log(m[0]);
}
