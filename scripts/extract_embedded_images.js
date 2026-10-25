const fs = require('fs');
const path = require('path');

function extractBase64Images(svgPath, outDir) {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const content = fs.readFileSync(svgPath, 'utf8');

  // Match pattern definitions or image href with data:image
  const regex = /id="([^"]+)"[^>]*>[\s\S]*?<image[^>]+xlink:href="(data:image\/[a-zA-Z]+;base64,[^"]+)"/g;
  let match;
  let count = 0;
  while ((match = regex.exec(content)) !== null) {
    count++;
    const id = match[1];
    const dataUri = match[2];
    const ext = dataUri.substring(dataUri.indexOf('/') + 1, dataUri.indexOf(';'));
    const base64Data = dataUri.substring(dataUri.indexOf('base64,') + 7);
    const outPath = path.join(outDir, `${id}.${ext}`);
    fs.writeFileSync(outPath, Buffer.from(base64Data, 'base64'));
    console.log(`Extracted: ${outPath} (${(base64Data.length / 1024).toFixed(1)} KB)`);
  }

  // Also check direct <image id="..." ... xlink:href="data:..."
  const regex2 = /<image[^>]+id="([^"]+)"[^>]+xlink:href="(data:image\/[a-zA-Z]+;base64,[^"]+)"/g;
  while ((match = regex2.exec(content)) !== null) {
    count++;
    const id = match[1];
    const dataUri = match[2];
    const ext = dataUri.substring(dataUri.indexOf('/') + 1, dataUri.indexOf(';'));
    const base64Data = dataUri.substring(dataUri.indexOf('base64,') + 7);
    const outPath = path.join(outDir, `${id}.${ext}`);
    fs.writeFileSync(outPath, Buffer.from(base64Data, 'base64'));
    console.log(`Extracted direct: ${outPath} (${(base64Data.length / 1024).toFixed(1)} KB)`);
  }

  // Fallback if patterns have nested images
  if (count === 0) {
    const rawMatches = [...content.matchAll(/xlink:href="(data:image\/([a-zA-Z]+);base64,([^"]+))"/g)];
    rawMatches.forEach((m, idx) => {
      const ext = m[2];
      const base64 = m[3];
      const outPath = path.join(outDir, `img_${idx + 1}.${ext}`);
      fs.writeFileSync(outPath, Buffer.from(base64, 'base64'));
      console.log(`Extracted raw: ${outPath} (${(base64.length / 1024).toFixed(1)} KB)`);
    });
  }
}

console.log('--- Extracting Catalogue SVG images ---');
extractBase64Images('public/Transact Catalogue.svg', 'public/extracted_catalogue');

console.log('--- Extracting FAQ SVG images ---');
extractBase64Images('public/Transact F.A.Q.svg', 'public/extracted_faq');
