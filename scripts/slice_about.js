const fs = require('fs');
const sharp = require('sharp');

async function run() {
  let svgStr = fs.readFileSync('public/Transact INTL About us.svg', 'utf8');
  console.log('Original size:', svgStr.length);

  // Replace huge data:image/png;base64,... with tiny 1x1 transparent png
  const tinyPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAA';
  svgStr = svgStr.replace(/xlink:href="data:image\/[^"]+"/g, `xlink:href="${tinyPng}"`);
  console.log('Cleaned size:', svgStr.length);

  const svgBuf = Buffer.from(svgStr);

  const slices = [
    { name: 'about_s1_hero', y: 0, h: 1000 },
    { name: 'about_s2_story', y: 900, h: 1200 },
    { name: 'about_s3_process', y: 2000, h: 1200 },
    { name: 'about_s4_facility', y: 3100, h: 1100 },
    { name: 'about_s5_values', y: 4100, h: 1100 },
    { name: 'about_s6_categories', y: 5100, h: 1100 }
  ];

  for (const s of slices) {
    try {
      const outPath = `public/temp_${s.name}.png`;
      await sharp(svgBuf, { density: 72 })
        .extract({ left: 0, top: s.y, width: 1952, height: s.h })
        .png()
        .toFile(outPath);
      console.log(`Saved ${outPath}`);
    } catch (e) {
      console.error(`Failed ${s.name}:`, e.message);
    }
  }
}

run();
