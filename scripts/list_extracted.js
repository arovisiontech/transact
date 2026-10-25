const fs = require('fs');
const path = require('path');

const dir = path.join('public', 'images', 'about');
const files = fs.readdirSync(dir).filter(f => f.startsWith('extracted_'));
files.forEach(f => {
  const stat = fs.statSync(path.join(dir, f));
  console.log(f, stat.size, 'bytes');
});
