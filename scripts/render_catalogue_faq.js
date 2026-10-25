const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function renderSlices(svgPath, prefix) {
  const dir = path.join('public', 'slices_' + prefix);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const svgBuffer = fs.readFileSync(svgPath);
  
  // Render full SVG at scaled resolution (width 1200)
  // Height = 3233 * 1200 / 1920 ~= 2020
  const fullPng = await sharp(svgBuffer, { density: 150 })
    .resize(1200)
    .png()
    .toBuffer();

  const metadata = await sharp(fullPng).metadata();
  console.log(prefix, 'rendered dimensions:', metadata.width, 'x', metadata.height);

  // Slice into 3 vertical chunks: Top (Hero/Header), Middle (Main Content), Bottom (Footer/CTA)
  const chunkHeight = Math.floor(metadata.height / 3);

  for (let i = 0; i < 3; i++) {
    const outPath = path.join(dir, `slice_${i + 1}.png`);
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
  await renderSlices('public/Transact Catalogue.svg', 'catalogue');
  await renderSlices('public/Transact F.A.Q.svg', 'faq');
}

run().catch(console.error);
