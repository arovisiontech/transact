const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processSvg(svgPath, prefix) {
  let content = fs.readFileSync(svgPath, 'utf8');

  // Replace huge data URIs with extracted file paths (or small 1x1 transparent png) so sharp parses it instantly without buffer limits
  const transparentPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAAElFTkSuQmCC';
  const cleanSvg = content.replace(/data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+/g, transparentPng);

  const outDir = path.join('public', 'slices_' + prefix);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const fullPng = await sharp(Buffer.from(cleanSvg), { density: 150 })
    .resize(1200)
    .png()
    .toBuffer();

  const metadata = await sharp(fullPng).metadata();
  console.log(prefix, 'dimensions:', metadata.width, 'x', metadata.height);

  const chunkHeight = Math.floor(metadata.height / 3);
  for (let i = 0; i < 3; i++) {
    const outPath = path.join(outDir, `slice_${i + 1}.png`);
    await sharp(fullPng)
      .extract({
        left: 0,
        top: i * chunkHeight,
        width: metadata.width,
        height: (i === 2) ? (metadata.height - i * chunkHeight) : chunkHeight,
      })
      .toFile(outPath);
    console.log('Saved', outPath);
  }
}

async function run() {
  await processSvg('public/Transact Catalogue.svg', 'catalogue');
  await processSvg('public/Transact F.A.Q.svg', 'faq');
}

run().catch(console.error);
