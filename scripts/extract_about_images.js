const fs = require('fs');
const path = require('path');

const svg = fs.readFileSync('public/Transact INTL About us.svg', 'utf8');

const regex = /<image\s+id="([^"]+)"\s+width="([^"]+)"\s+height="([^"]+)"[^>]*?xlink:href="data:image\/([^;]+);base64,([^"]+)"/g;

let m;
let count = 0;
const outDir = path.join('public', 'images', 'about');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

while ((m = regex.exec(svg)) !== null) {
  const id = m[1];
  const w = m[2];
  const h = m[3];
  const ext = m[4] === 'jpeg' ? 'jpg' : m[4];
  const base64Data = m[5];
  const outPath = path.join(outDir, `extracted_${count}_${id}_${w}x${h}.${ext}`);
  fs.writeFileSync(outPath, Buffer.from(base64Data, 'base64'));
  console.log(`Saved: ${outPath} (${w}x${h})`);
  count++;
}
