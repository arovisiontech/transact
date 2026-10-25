const fs = require('fs');
const svg = fs.readFileSync('public/Transact INTL About us.svg', 'utf8');

['EU-MDR', 'GMP', 'ISO', 'FDA', 'CE'].forEach(tag => {
  let idx = 0;
  while ((idx = svg.indexOf(tag, idx)) !== -1) {
    console.log(`Found ${tag} at ${idx}:`, svg.substring(idx - 100, idx + 100).replace(/\n/g, ' '));
    idx += tag.length;
  }
});
