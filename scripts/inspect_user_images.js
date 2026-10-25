const fs = require('fs');

const files = [
  'Rectangle 819 (1).svg',
  'Rectangle 1097.svg',
  'Rectangle 1098.svg',
  'image 421.svg',
  'image 422.png',
  'image 424.svg',
  'image 425.png'
];

files.forEach(f => {
  const p = 'public/' + f;
  if (!fs.existsSync(p)) {
    console.log(f, 'DOES NOT EXIST');
    return;
  }
  const stat = fs.statSync(p);
  console.log(f, 'size:', stat.size);
  if (f.endsWith('.svg')) {
    const s = fs.readFileSync(p, 'utf8');
    const vb = s.match(/<svg[^>]+>/)?.[0];
    console.log(f, vb?.substring(0, 120));
  } else if (f.endsWith('.png')) {
    const b = fs.readFileSync(p);
    console.log(f, 'dimensions:', b.readUInt32BE(16), 'x', b.readUInt32BE(20));
  }
});
